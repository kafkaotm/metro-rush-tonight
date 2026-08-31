# 專案說明：臺北捷運首末班車查詢（改版）

## 專案目標

改寫臺北捷運官網的「各站首末班車時間」查詢頁面，用自訂 UI/UX 改善查詢流程。

原始參考頁面：https://www.metro.taipei/cp.aspx?n=5298D33851223B04

## 核心使用者流程

1. 使用者先選擇「路線」（例如：淡水信義線、板南線）
2. 依所選路線，列出該路線所有站點供使用者選擇
3. 使用者選定站點後，顯示該站首班車 / 末班車時間（需區分平日/假日、去程/返程）

流程設計重點：先篩選路線 → 再篩選站點 → 再查時間，
比原網站操作更直覺，也是動態轉場/篩選互動的主要展現點。

## 資料來源：TDX 運輸資料流通服務

已申請 TDX 會員帳號，每月額度 3,000 次呼叫。

會用到的端點：

| 端點 | 用途 |
|---|---|
| `/Line/{RailSystem}` | 取得所有路線清單（LineID、LineName、LineColor 等） |
| `/StationOfLine/{RailSystem}` | 依路線取得該線所有站點（含站序） |
| `/FirstLastTimetable/{RailSystem}` | 依站點取得首末班車時刻表 |

`{RailSystem}` 會分別打 `TRTC`（臺北捷運本體）跟 `NTMC`（環狀線，
行政上屬新北捷運公司營運）兩次，結果合併成同一份靜態 JSON。這兩個系統的
`LineID`／`StationID` 命名空間互不重疊（環狀線是 `Y`／`Y01`~`Y21`，
不會撞到 `BL`／`BR`／`G`／`O`／`R` 開頭的既有站點），可以直接合併，
不需要額外的衝突處理邏輯。使用者體感上環狀線就是路網的一部分（官方路網圖
本來就把它畫在一起），所以查詢頁面把它當作第 6 條路線正常呈現。

Swagger UI 是前端渲染的 SPA，無法直接爬取；OpenAPI JSON 原始文件可直接下載：
https://tdx.transportdata.tw/webapi/File/Swagger/V3/268fc230-2e04-471b-a728-a726167c1cfc

已對照上述文件確認的欄位結構（`components.schemas`）：

- **`NameType`**（各種名稱共用型別）：`Zh_tw`（必填）、`En` / `Ja` / `Ko`（皆可為 null）
- **`Line`**：`LineID`、`LineName: NameType`、`LineSectionName: NameType`、`LineColor`、
  `LineNo`（可為 null）、`IsBranch`、`VersionID`、`SrcUpdateTime`、`UpdateTime`
- **`StationOfLine`**：`LineID`、`Stations: Station[]`
  - `Station`：`StationID`、`StationName: NameType`、`Sequence`、`CumulativeDistance`（可為 null）
- **`FirstLastTimetable`**：`LineID`、`StationID`、`StationName: NameType`、
  `DestinationStaionID`（注意官方拼字少一個 t）、`DestinationStationName: NameType`、
  `TripHeadSign`（可為 null，去程/返程描述）、`TrainType`（0:不分車種,1:普通車,2:直達車，可為 null）、
  `FirstTrainTime`、`LastTrainTime`（字串格式，非 ISO datetime）、`ServiceDay`
  - `ServiceDay`：`Monday`~`Sunday`、`NationalHolidays`（皆為 boolean）、`ServiceTag`（可為 null）

這些欄位已用真實憑證實測過（詳見下方轉乘研究），大致符合官方規格，
但有一處落差：`LineSectionName` 實測回傳 `{}`（非分支路線完全沒有 `Zh_tw`），
因此程式碼裡型別已改為 `Partial<NameType>`。

## 未來功能（v2）：轉乘查詢

首末班車查詢（v1）先只做單站查詢，不含轉乘。以下是研究 TDX API 後的結論，
留給之後要做「末班車轉乘是否來得及」這類功能時參考：

- **轉乘站的跨線對應關係、以及轉乘所需時間，TDX 都有專門端點提供，不需要自己
  用站名比對或手動維護表格**：
  - `/LineTransfer/{RailSystem}`：`FromLineID`/`FromStationID` →
    `ToLineID`/`ToStationID` 的轉乘關係，附 `TransferTime`（分鐘）、
    `IsOnSiteTransfer`（1=站內轉乘、0=需走到另一站體）。實測台北車站
    BL↔R 站內轉乘、西門 BL↔G 是 2 分鐘、板橋 BL↔Y 要 11 分鐘。
  - `/TransferStations/{RailSystem}`：官方定義的轉乘站分組，
    `TransferStationID` → `Stations[]`（跨線的多個 `StationID`），
    比自己用站名字串比對可靠。
  - `/StationTransfer/{RailSystem}`：更細的轉乘資訊（分樓層、出口，
    還包含公車/停車場/計程車等站外轉乘），做進階版可以再參考。
- **注意：`RailSystem` 代碼在不同端點不一致。** `Line`、`StationOfLine`、
  `FirstLastTimetable`、`LineTransfer` 都吃 `TRTC`，但 `/TransferStations`
  只接受 `TRTC_NTMC`（把臺北捷運跟新北捷運合併看待）或 `KRTC`，
  傳 `TRTC` 會直接 400。串接轉乘功能時要注意這個端點對應的代碼要換。
- **範圍缺口：`LineTransfer` 資料裡出現 `Y`（環狀線），但這條線不在
  `/Line/TRTC` 裡**（環狀線屬於新北捷運系統）。也就是說可以查到「這裡可以
  轉乘到環狀線」，但沒有環狀線本身的首末班車資料可以接著查——除非額外抓
  `/Line/NTMC` 之類的端點。做轉乘功能前要先決定：只做 TRTC 系統內部轉乘，
  還是要含環狀線這種跨系統轉乘。
- TDX 額度（3,000 次/月）完全不是限制因素，這幾支端點抓取頻率跟現有三支
  一樣（CI 排程時一起抓即可）。

## 資料策略：靜態 JSON + CI 定期更新

首末班車時間更新頻率極低（一年可能僅變動一兩次），因此採用以下策略：

- **不在使用者查詢當下呼叫 TDX API**，前端只讀取本地靜態 JSON
- 所有篩選（路線 → 站點 → 時間）皆為前端邏輯處理，不需後端伺服器
- 資料更新改用 **CI 排程定期抓取**（例如 GitHub Actions cron job，
  頻率可設定每週或每月一次），抓取後自動更新專案內的靜態 JSON 並 commit

### TDX 憑證（Client ID / Secret）管理方式

- 憑證存放於 CI 平台的加密 Secrets 機制（如 GitHub Actions 的
  Settings → Secrets and variables → Actions），**不寫入程式碼、不 commit**
- Workflow 內透過 `${{ secrets.TDX_CLIENT_ID }}` 等語法注入為環境變數，
  執行時才存在於記憶體中，log 中會自動遮蔽
- 本機開發時憑證放在 `.env`，並確保 `.env` 已加入 `.gitignore`

## 技術棧

- Vue.js + TypeScript
- pnpm 作為套件管理工具
- 開發環境：fnm 管理 Node 版本、Homebrew 管理系統工具

## 開發方式：TDD

專案採用 TDD（測試驅動開發）方式建構基本結構，流程慣例：

1. 先針對單一功能（例如「依路線篩選站點」）寫測試案例，**不先寫實作**
2. 確認測試案例合理後，再寫最少量的程式碼讓測試通過
3. 通過後再視情況 refactor

與 Claude Code 協作時，請遵循上述順序，優先產出測試，
待使用者確認測試案例後，才進行實作。

## 尚待確定事項

- CI 排程的實際頻率與 workflow 設計細節
- 具體動效設計（路網視覺化、搜尋篩選、倒數提示等）尚在構思階段
- 轉乘查詢（v2）：範圍與設計細節見上方「未來功能」章節