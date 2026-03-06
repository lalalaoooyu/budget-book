# Budget Book / 家計簿

A lightweight personal budget tracking app built with React + TypeScript.

軽量な個人向け家計簿アプリ。React + TypeScript で構築。

## Features / 機能

- **Dashboard / 総覧** - Overview of assets, liabilities, income, expenses and net worth / 資産・負債・収支・純資産の一覧表示
- **Transaction Management / 収支管理** - Add, edit, delete entries with category filtering / 項目の追加・編集・削除、カテゴリ別フィルタリング
- **Subscription Tracker / サブスク管理** - Manage monthly subscriptions / 月額サブスクリプションの管理
- **Asset History / 資産推移** - Track asset trends over time with interactive charts / インタラクティブなチャートで資産推移を追跡
- **Data Backup / データバックアップ** - Export/import data as JSON files / JSONファイルでデータの導出・導入
- **Bilingual / 二言語対応** - Japanese / English language support / 日本語・英語切り替え対応

## Data Storage / データ保存について

This app uses your browser's **localStorage** to save all data. Here's what you need to know:

本アプリはブラウザの **localStorage** を使用してデータを保存します。以下の点にご注意ください：

### How it works / 仕組み

- All data (transactions, subscriptions, asset history, language preference) is automatically saved in your browser whenever you make changes.
- Data persists across page refreshes, tab closures, and browser restarts.
- Each browser maintains its own separate data — data is not shared between different browsers or devices.

- すべてのデータ（収支、サブスク、資産推移、言語設定）は変更のたびに自動的にブラウザに保存されます。
- ページの更新、タブの終了、ブラウザの再起動後もデータは保持されます。
- データはブラウザごとに独立しています。異なるブラウザやデバイス間でデータは共有されません。

### When data will be lost / データが消える場合

- Clearing browser cache or site data / ブラウザのキャッシュやサイトデータを削除した場合
- Using incognito/private browsing mode / シークレットモード・プライベートブラウジングを使用した場合

### Export (backup) / データの導出（バックアップ）

1. Click the **"導出" / "Export"** button in the top-right header.
2. A JSON file named `kakeibo-backup-YYYY-MM-DD.json` will be downloaded to your default download folder.
3. This file contains all your data — keep it somewhere safe (e.g. iCloud Drive, Google Drive).
4. We recommend exporting regularly to avoid accidental data loss.

1. ヘッダー右上の **「導出」/ "Export"** ボタンをクリックします。
2. `kakeibo-backup-YYYY-MM-DD.json` というJSONファイルがデフォルトのダウンロードフォルダに保存されます。
3. このファイルにはすべてのデータが含まれています。安全な場所（iCloud Drive、Google Driveなど）に保管してください。
4. データの消失を防ぐため、定期的な導出をおすすめします。

### Import (restore) / データの導入（復元）

1. Click the **"導入" / "Import"** button in the top-right header.
2. Select a previously exported `.json` backup file.
3. All data will be restored and overwrite the current data.
4. A confirmation alert will appear when the import is successful.

1. ヘッダー右上の **「導入」/ "Import"** ボタンをクリックします。
2. 以前に導出した `.json` バックアップファイルを選択します。
3. すべてのデータが復元され、現在のデータは上書きされます。
4. 導入が成功すると確認メッセージが表示されます。

## Tech Stack / 技術スタック

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- Chart.js

## Getting Started / はじめに

```bash
npm install
npm run dev
```

## License / ライセンス

© 2026 Alice Yu (JIATIAN YU). All rights reserved.
