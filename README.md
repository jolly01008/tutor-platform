# 英文媒合家教平台 tutor-platform

![image](https://github.com/jolly01008/tutor-platform/blob/main/public/readmeImage/image01.png)
![image](https://github.com/jolly01008/tutor-platform/blob/main/public/readmeImage/image02.png)
![image](https://github.com/jolly01008/tutor-platform/blob/main/public/readmeImage/image03.png)

## 介紹

一對一英文家教預約平台。
使用者可以註冊、登入、編輯個人資料，進而瀏覽所有老師相關資訊，預約課程、課後評價老師。
使用者透過輸入指定的資料，可以從學生身分，申請成為老師。老師能選擇星期幾開課、提供上課相關資訊，讓學生預約課程。
後臺管理者可以查看所有使用者資訊

## 功能

- 未登入

  - 一般使用者可以註冊及登入帳號
  - 一般使用者可以透過 Google Login 註冊、登入
  - 後臺管理者可以切換到 admin 頁面進行登入

- 登入後

  - 一般使用者-學生身分

    - 學生可以在首頁瀏覽所有老師
    - 學生可以在首頁搜尋老師姓名或資訊
    - 學生可以查看單一老師頁面的課程資訊、評論
    - 學生可以在單一老師頁面預約近兩週的課程
    - 學生可以在首頁瀏覽學習時數前十名的使用者
    - 學生可以進入個人頁面
    - 學生可以查看個人資料、新課程、舊課程、學習時數名次
    - 學生可以對上過的課程老師進行評分、評論
    - 學生可以編輯個人資料
    - 學生可以登出
    - 學生若還不是老師，可以填寫資料申請成為老師

  - 一般使用者-老師身分

    - 老師可以在首頁瀏覽所有老師
    - 老師可以在首頁搜尋老師姓名或資訊
    - 老師可以瀏覽其他老師的課程資訊、評論
    - 老師可以在首頁瀏覽學習時數前十名的使用者
    - 老師可以進入個人頁面
    - 老師可以查看個人資料、新課程、舊課程的評分分數
    - 老師可以編輯個人資料、課程相關資訊
    - 老師可以登出

  - 後臺管理者-Admin 身分
    - Admin 可以在 admin 頁面瀏覽所有使用者的相關資訊

## 共用帳號

- 第一組 user 帳號 (學生身分)

  - email: user1@example.com
  - password: 12345678

- 第二組 user 帳號 (老師身分)

  - email: user2@example.com
  - password: 12345678

- 第一組 admin 帳號 (Admin 身分)

  - email: root@example.com
  - password: 12345678

## 開始使用

1. 請先確認有安裝 node.js 與 npm

2. 將專案 clone 到本地

3. 開啟終端機(Terminal)，進入存放此專案的資料夾

```
cd tutor-platform
```

4. 安裝所需套件

```
npm i [套件名稱]
```

5. 設置.env 檔

```
請修改 `.env.example` 成 .env，並設定相關參數
```

6. 匯入種子檔案

```
npm run seed
```

7. 啟動伺服器，執行 app.js 檔案

```
npm run dev
```

8. 當 terminal 出現以下字樣，表示伺服器已啟動

> Express is running on http://localhost:3000

## 開發工具

- Node.js 14.16.0
- nodemon
- bcryptjs 2.4.3
- connect-flash 0.1.1
- Express 4.17.1
- Express-Handlebars 5.3.3
- express-session 1.17.2
- faker 5.5.3
- imgur 1.0.2
- dotenv 8.2.0
- method-override 3.0.0
- multer 1.4.3
- mysql2 2.1.0
- passport 0.4.1
- passport-google-oauth20 2.0.0
- passport-local 1.0.0
- dayjs 1.10.6
- sequelize 5.21.13
- sequelize-cli 6.2.0
