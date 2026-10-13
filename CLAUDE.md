# portfolio10

個人のポートフォリオサイト（Next.js）。GitHub: `TAKAkaka285/portfolio10` / 本番: https://portfolio10-pied.vercel.app

これは個人プロジェクトであり、lt-three 配下のリポジトリ向けのルール（PR の reviewer 指定など）は適用しない。

## データ（画像・動画・音声など）は Vercel Blob に置く

**メディアファイルは git に commit しない。Vercel Blob にアップロードして配信する。**

- 対象: 画像（png/jpg/webp/svg）、アイコン、動画、音声、その他サイズの大きいデータ全般
- ダミー素材も同じ。`public/` に置いてもよいが、commit せず Blob にアップロードする
- Blob ストア: `portfolio10-blob`（Public、リージョン hnd1、ID `store_nvTL9MmBRuFqJToF`）
- 配信 URL の起点: `https://nvtl9mmbrufqjtof.public.blob.vercel-storage.com`

### 配信の仕組み
`next.config.mjs` の `rewrites`（`beforeFiles`）で、`/images/*` `/icons/*` `/video/*` を Blob の同名パスに転送している。
コードからはこれまでどおり `/images/foo.png` のパスで参照する（Blob の URL は直接書かない）。
新しいディレクトリ名（例: `/audio/`）を使うときは、`next.config.mjs` の配列に追加する。

### ローカルの扱い
`public/images/` `public/icons/` `public/video/` は `.gitignore` 済み。手元にファイルがあっても commit されない。
新しいメディア用ディレクトリを `public/` に作るときは、先に `.gitignore` に追加する。

### アップロード手順
1. 認証: `npx vercel@latest env pull .env.local --yes`（`BLOB_READ_WRITE_TOKEN` などが `.env.local` に入る。初回は `vercel login` が必要）。
   トークンの値はチャットやコミットに出さない。`.env.local` は `.gitignore` 済み。
2. `@vercel/blob` の `put()` で、`public/` からの相対パスと同じパスにアップロードする（例: `images/foo.png`）。
   `access: "public"`、`addRandomSuffix: false`、`allowOverwrite: true`、`cacheControlMaxAge` は長め（1 年）にする。
   アップロード用のスクリプトと `@vercel/blob` はリポジトリの外の一時フォルダに置く（依存を増やさない）。
3. 同じパスで上書きすると、CDN とブラウザのキャッシュで反映が遅れる。差し替えたときは、ファイル名を変えるか、クエリ（`?v=2` など）を付けて確認する。

### 無料枠（Hobby）の目安
保存 1GB、転送 10GB/月、読み込み系 1 万回、書き込み系 2,000 回。超えると 30 日間 Blob が使えなくなる。
連番画像を大量に置く構成は避ける（以前の人物シーンは約 4,260 枚の連番で、これが原因で動画 1 本にまとめた）。

## デプロイ

- この Vercel プロジェクトは GitHub と未接続。main に merge しても自動デプロイされない。
- 本番反映は、コミット済みの内容だけを別フォルダに取り出して `vercel deploy --prod` を実行する
  （作業フォルダのままだと `video_work/` などでファイル数の上限 15,000 を超える）。
  例: `git archive HEAD | tar -x -C <別フォルダ>` → `.vercel/` をコピー → そのフォルダで `npx vercel@latest deploy --prod --yes`。
- 先に `vercel deploy`（--prod なし）でプレビューを確認する。プレビューは Vercel のログインが必要。

## 人物の深度シーン（`components/HumanDepthScene.tsx`）

- 素材は `public/video/depth_scene_grid.mp4`（400x270、左 = マスク / 右 = 深度、9fps、グリッド 200x270 と同サイズ）。Blob にある。
- 重さの主因は GPU の三角形数。丸い立方体の分割数（`RoundedBoxGeometry` の segments）は 1。増やすと重くなる。
- 表示する粒だけを詰めて描画している（`counts` と `inst.count`）。非表示分を GPU に渡す作りに戻さない。
