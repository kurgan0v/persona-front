/** @type {import('next').NextConfig} */
const path = require('path');
const nextConfig = {
    images: {
        domains: ["localhost", "xn--64-6kct4bffjj.xn--p1ai", "217.28.220.65:3000", "217.28.220.65:3030", "217.28.220.65", "basket-12.wb.ru"],
    },
    distDir: 'build',
    env: {
        APP_BASE_URL: process.env.APP_BASE_URL
    },
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@': path.resolve(__dirname, './'),
        };

        return config;
    },
}



module.exports = nextConfig
