# StudyFlow

iPhone・PC向けの、外部サービス不要で動く勉強記録アプリです。データはブラウザの `localStorage` に保存されます。

## ファイル構成

```text
study-app/
├─ index.html       画面の土台
├─ style.css        デザイン、レスポンシブ、ダークモード
├─ script.js        アプリの全機能とデータ保存
├─ questions.js     最初から入っている問題
├─ manifest.json    ホーム画面追加用の設定
├─ sw.js            オフライン表示用Service Worker
├─ icon.svg         アプリアイコン
└─ README.md        この説明書
```

## 実装済み

- 今日・累計の学習時間、目標、7日グラフ、最近の科目
- 科目の追加・編集・削除
- 4択、○×、一問一答、解説、正答率、復習、お気に入り、検索
- 問題の追加・編集・削除
- タイマー、手動記録、科目別集計、月間カレンダー、履歴
- 連続学習日数、ライト・ダーク切替
- JSONバックアップ・復元、全データ初期化
- スマートフォン・PC対応、ホーム画面追加、オフラインキャッシュ

## GitHub Pagesで公開する手順（iPhone）

1. Safariで GitHub にログインします。
2. 右上の `+` から `New repository` を選びます。
3. Repository name を `studyflow` などにし、Publicを選択して作成します。
4. リポジトリの `Add file` → `Create new file` を開きます。
5. ファイル名に `index.html` と入力し、このプロジェクトの同名ファイル全文を貼り付けます。
6. `Commit changes` を押します。
7. 同じ操作で `style.css`、`script.js`、`questions.js`、`manifest.json`、`sw.js`、`icon.svg`、`README.md` を作ります。すべてリポジトリ直下に置きます。
8. リポジトリの `Settings` → `Pages` を開きます。
9. Build and deployment の Source で `Deploy from a branch` を選びます。
10. Branchを `main`、フォルダを `/(root)` にして `Save` を押します。
11. Pages画面に表示される公開URLをSafariで開きます。

公開URLの例：`https://あなたのユーザー名.github.io/studyflow/`

## iPhoneのホーム画面に追加

1. 公開URLをSafariで開きます。
2. 共有ボタンをタップします。
3. `ホーム画面に追加` を選びます。
4. 表示される場合は `Webアプリとして開く` をオンにします。
5. `追加` をタップします。

## 大切な注意

- データは利用しているブラウザ・端末内に保存されます。Safariのサイトデータを消すと学習データも消えるため、設定画面から定期的にバックアップしてください。
- 別端末には自動同期されません。設定画面のバックアップと復元で移動できます。
- 将来の複数端末同期は、`load()` と `save()` をAPI通信に差し替えられる構造です。
- `questions.js` を後で変更しても、すでに利用中の端末にはlocalStorage側の問題データが優先されます。
