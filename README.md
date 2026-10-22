# 台灣 3D 旅遊導覽與觀光集章冊

React + Vite + Tailwind CSS + React Three Fiber 製作的 3D 台灣地圖與集章冊。地形為程序化產生，不需要任何地圖 API Token。

## 本機執行

```bash
npm install
npm run dev
```

## 部署到 GitHub Pages

1. 推送到 GitHub 的 `main` 分支。
2. 到 repo 的 **Settings → Pages**，把 Source 設為 **GitHub Actions**。
3. `.github/workflows/deploy.yml` 會自動建置並發佈 `dist/`。

`vite.config.js` 已設定 `base: './'`，部署在任何子路徑都能正常載入。

## 檔案結構

| 檔案 | 用途 |
| --- | --- |
| `src/App.jsx` | 主畫面、篩選、光影切換、地圖控制、localStorage |
| `src/components/TaiwanMap3D.jsx` | 3D 地形、五種低多邊形地標、光影模式、相機動畫 |
| `src/components/StampModal.jsx` | 景點頁、木章蓋章動畫、音效、彩帶、導覽資訊、Gemini 介面 |
| `src/components/PassportView.jsx` | 集章冊、進度、頭銜、100 格章戳 |
| `src/components/CertificateView.jsx` | 成就證書、列印、下載 PNG |
| `src/components/ItineraryModal.jsx` | 環島路線規劃 |
| `src/components/Seal.jsx` | 朱紅紀念章 SVG |
| `src/components/SpotHero.jsx` | 景點插畫主視覺（可換成實景照片） |
| `src/data/spotsData.js` | 100 景點資料、分類、區域、頭銜 |
| `src/utils/geo.js` | 海岸線、地形高度、座標換算 |
| `src/utils/sound.js` | Web Audio 敲章音效 |

## 換上實景照片

在 `spotsData.js` 的景點加上 `image: 'https://…'`（精簡資料則寫在第 8 個欄位 `{ image: '…' }`）。圖片載入失敗時會自動退回插畫。

## 接上 Gemini

`StampModal.jsx` 的 `GeminiGuideCard` 目前只有介面。若要接 API，請透過自己的後端代理呼叫，不要把 API 金鑰放進前端程式碼。
