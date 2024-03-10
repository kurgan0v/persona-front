import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import '@/fsd/app/styles/global.scss';
import {Open_Sans} from 'next/font/google'
import ClientProvider from "@/fsd/app/providers/ClientProvider/ClientProvider";
import localFont from 'next/font/local'
import {clsx} from "clsx";
import {Metadata} from "next";

const openSans = Open_Sans({
    subsets: ['latin'],
})
const linguisticsPro = localFont({
    src: '../public/LinguisticsPro.otf',
    variable: '--font-linguistics',
})


export async function generateMetadata(): Promise<Metadata> {
    const res = await fetch(`${process.env.APP_BASE_URL}/seo/metadata/main`, { next: { revalidate: 0 } })
    try{
        return await res.json();
    } catch (e) {
        return {}
    }
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="ru" className={clsx(openSans.className, linguisticsPro.variable)} suppressHydrationWarning>
        <head>
            <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png"/>
            <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png"/>
            <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png"/>
            <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png"/>
            <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png"/>
            <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png"/>
            <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png"/>
            <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png"/>
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png"/>
            <link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
            <link rel="manifest" href="/manifest.json"/>
            <meta name="msapplication-TileColor" content="#ffffff"/>
            <meta name="msapplication-TileImage" content="/ms-icon-144x144.png"/>
            <meta name="theme-color" content="#ffffff"/>
            <meta name="yandex-verification" content="423121c208931ad9" />
            <meta name="google-site-verification" content="1r4qHuWI-c6q4e-Cg4qDzeyYr8bLjqlwacS2RhpNQEg" />
        </head>
        <body>
        <main>
            <ClientProvider>
                {children}
            </ClientProvider>
        </main>
        </body>
        </html>
    )
}
