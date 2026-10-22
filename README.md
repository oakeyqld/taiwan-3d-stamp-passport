# 台灣 3D 旅遊導覽與觀光集章冊

React + Vite + Tailwind CSS + React Three Fiber 製作的 3D 台灣地圖與集章冊。所有檔案都放在專案根目錄，不需要資料夾。

## 上傳到 GitHub

1. 在 GitHub 建立新的 repository。
2. 點 **Add file → Upload files**，把全部檔案一次拖進去，按 **Commit changes**。
   （`.gitignore` 在部分電腦上是隱藏檔，看不到也沒關係，不影響運作。）

## 自動部署到 GitHub Pages

GitHub 規定部署設定檔必須放在 `.github/workflows/` 裡，這是唯一需要路徑的檔案，但不用自己建資料夾：

1. 在 repo 點 **Add file → Create new file**。
2. 檔名欄輸入 `.github/workflows/deploy.yml`（輸入斜線時 GitHub 會自動建立資料夾）。
3. 把 `deploy.yml` 的內容整個貼上，按 **Commit changes**。
4. 到 **Settings → Pages**，Source 選 **GitHub Actions**。

完成後每次更新檔案都會自動重新部署。根目錄那份 `deploy.yml` 留著或刪掉都可以。

## 本機執行

```bash
npm install
npm run dev
```

## 檔案說明

| 檔案 | 用途 |
| --- | --- |
| `App.jsx` | 主畫面、篩選、光影切換、地圖控制、localStorage |
| `TaiwanMap3D.jsx` | 3D 地形、五種低多邊形地標、光影模式、相機動畫 |
| `StampModal.jsx` | 景點頁、木章蓋章動畫、音效、彩帶、導覽資訊、Gemini 介面 |
| `PassportView.jsx` | 集章冊、進度、頭銜、100 格章戳 |
| `CertificateView.jsx` | 成就證書、列印、下載 PNG |
| `ItineraryModal.jsx` | 環島路線規劃 |
| `Seal.jsx` | 朱紅紀念章 SVG |
| `SpotHero.jsx` | 景點插畫主視覺（可換成實景照片） |
| `CategoryIcon.jsx` | 分類圖示 |
| `spotsData.js` | 100 景點資料、分類、區域、頭銜 |
| `geo.js` | 海岸線、地形高度、座標換算 |
| `sound.js` | Web Audio 敲章音效 |
| `main.jsx`、`index.html`、`index.css` | 進入點與全域樣式 |
| `vite.config.js`、`tailwind.config.js`、`postcss.config.js` | 建置設定 |
| `deploy.yml` | GitHub Pages 自動部署設定（用法見上方） |

## 換上實景照片

在 `spotsData.js` 的景點加上 `image: 'https://…'`（精簡資料則寫在第 8 個欄位 `{ image: '…' }`）。圖片載入失敗時會自動退回插畫。

## 接上 Gemini

`StampModal.jsx` 的 `GeminiGuideCard` 目前只有介面。若要接 API，請透過自己的後端代理呼叫，不要把 API 金鑰放進前端程式碼。
