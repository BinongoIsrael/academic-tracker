/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: 'https',
        hostname: 'hwujznmkmmpflxsrtcvo.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/users/**',
      },
    ],
  },
}

export default nextConfig;
