# 趕捷運 Metro Rush Tonight

「今晚我還趕得上末班車嗎？」——改寫自臺北捷運官網的「各站首末班車時間」查詢頁面，
聚焦末班車查詢，用「先選路線 → 再選站點 → 看末班車時間」的流程取代原站的操作方式。

線上版：https://kafkaotm.github.io/metro-rush-tonight/

## 功能（v1）

- 依路線（含環狀線）篩選站點，查詢該站末班車時間，去程/返程分開顯示
- 常用站點收藏（依「路線＋站點＋方向」），首頁顯示即時倒數
- 中/英文切換

**v1 不含**：首班車時間、轉乘查詢、平日/假日時間差異（目前實測資料兩者相同）、
即時停駛公告。細節與原因見 `CLAUDE.md`。

## 設計決策

- **靜態 JSON + CI 定期更新**，不在使用者查詢當下呼叫 TDX API——呼叫額度有限，
  且首末班車時間一年可能僅變動一兩次，前端零後端依賴，全部邏輯在瀏覽器端跑
- **收藏用穩定的 `DestinationStaionID` 當識別碼，而非顯示用的中文方向文字**
  （如「往淡水」）——避免顯示字串未來被官方改版就悄悄弄壞使用者已存的收藏
- **Pure-function-first 架構**——商業邏輯都拆進 `src/logic` 下獨立可測試的
  pure function，`.vue` 元件只負責瘦身接線，方便 TDD 時不用 mock 全域狀態
- **GitHub Pages 部署選 hash routing**（`createWebHashHistory`）——靜態主機
  沒有 server-side rewrite/catch-all，hash 模式不需要額外的 404 轉址技巧
  就能保證深連結（含收藏網址）在重新整理／直接分享時正常運作

每項決策的完整研究過程與取捨記錄在 `CLAUDE.md`（本專案採 TDD + spec-driven
方式與 Claude Code 協作開發）。

## 技術棧

Vue 3（`<script setup>` + TypeScript）、Vite、Tailwind CSS v4、Vue Router、
Vitest + @vue/test-utils，pnpm 管理套件。

## 本機開發

```bash
pnpm install
pnpm dev        # 開發伺服器
pnpm test       # 跑測試
pnpm run build  # 產出 dist/
```

## 資料來源與更新方式

資料來自 TDX 運輸資料流通服務（`Line`、`StationOfLine`、`FirstLastTimetable` 端點，
分別打 TRTC / NTMC 後合併），**不在使用者查詢當下呼叫 API**，前端只讀取
`src/data/*.json` 這份靜態資料。更新方式：

```bash
pnpm run fetch:tdx   # 需要 .env 裡的 TDX_CLIENT_ID / TDX_CLIENT_SECRET
```

首末班車時間更新頻率極低，未來規劃由 CI 排程定期執行上述腳本並自動 commit
（尚未實作，設計備忘見 `CLAUDE.md`）。

## 部署

`main` 分支有更新時，GitHub Actions（`.github/workflows/deploy-pages.yml`）
自動 build 並部署到 GitHub Pages。
