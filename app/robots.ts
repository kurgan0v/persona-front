import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/cart', '/checkout', '/thanks'],
        },
        sitemap: 'https://xn--64-6kct4bffjj.xn--p1ai/sitemap.xml',
    }
}
