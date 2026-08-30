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

會用到的端點（皆為臺北捷運 TRTC 系統）：

| 端點 | 用途 |
|---|---|
| `/Line/TRTC` | 取得所有路線清單（LineID、LineName、LineColor 等） |
| `/StationOfLine/TRTC` | 依路線取得該線所有站點（含站序） |
| `/FirstLastTimetable/TRTC` | 依站點取得首末班車時刻表 |

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

這些欄位是官方 API 規格，尚未實測過真實回傳資料（值的實際內容、邊界案例）。

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

- 欄位結構已對照官方 Swagger 確認（見上），但尚未用真實憑證實測過實際回傳資料
- CI 排程的實際頻率與 workflow 設計細節
- 具體動效設計（路網視覺化、搜尋篩選、倒數提示等）尚在構思階段