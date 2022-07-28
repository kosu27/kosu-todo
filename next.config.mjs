const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

if (!SUPABASE_URL) {
  throw new Error("環境変数が未定義 : env.NEXT_PUBLIC_SUPABASE_URL");
}

const DOMAIN = SUPABASE_URL.split("/").slice(-1)[0];

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  i18n: { locales: ["ja"], defaultLocale: "ja" },
  future: { strictPostcssConfiguration: true },
  reactStrictMode: true,
  poweredByHeader: false,
  swcMinify: true,
  // experimental: { concurrentFeatures: true, serverComponents: true },
  images: {
    domains: [DOMAIN],
  },
};

export default nextConfig;
