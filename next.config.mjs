// 画像・アイコン・動画は Vercel Blob に置いている（git には含めない）。
// 従来どおり /images/... /icons/... /video/... のパスで参照できるように転送する。
const BLOB_BASE = "https://nvtl9mmbrufqjtof.public.blob.vercel-storage.com";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: ["images", "icons", "video"].map((dir) => ({
        source: `/${dir}/:path*`,
        destination: `${BLOB_BASE}/${dir}/:path*`,
      })),
    };
  },
};

export default nextConfig;
