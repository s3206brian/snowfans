# 🏂 參與貢獻指南 (Contributing to SnowFans)

首先，超級感謝你對 SnowFans (snowfans.org) 充滿熱忱並願意貢獻你的時間！🙌
我們是一個由雪友與開發者共同組成的非營利開源社群。無論你是想幫忙修復 Bug、開發新功能、設計 UI，還是撰寫滑雪攻略，我們都非常歡迎！

為了讓大家的協作順暢、避免程式碼衝突，請在開始動手前，花 3 分鐘閱讀這份貢獻指南。

---

## ⚖️ 關於版權與 CLA (貢獻者授權協議)

本專案採用 **GNU AGPLv3** 授權。
為了保護專案未來的長遠發展與開源彈性，當你第一次發送 Pull Request (PR) 時，我們的 GitHub 機器人會請你同意一份簡單的 CLA 協議。這只是為了確保你有權利提交這些程式碼，並同意將其貢獻給 SnowFans 專案。

---

## 🛠️ 1. 準備工作 (Prerequisites)

在開始寫 Code 之前，請確保你的電腦已安裝以下環境：
- **Node.js**: >= 18.x
- **Package Manager**: 我們統一使用 `pnpm` (>= 8.x)。請勿使用 npm 或 yarn，以免產生 lockfile 衝突。
- **Git**: 基礎的版本控制工具。

---

## 💻 2. 本地端開發環境建立 (Local Setup)

請按照以下步驟，把 SnowFans 在你的電腦裡跑起來：

1. **Fork 本專案：**
   點擊本專案頁面右上角的 `Fork` 按鈕，將專案複製到你自己的 GitHub 帳號下。

2. **Clone 到本地端：**
   ```bash
   git clone [https://github.com/你的帳號/snowfans.git](https://github.com/你的帳號/snowfans.git)
   cd snowfans
