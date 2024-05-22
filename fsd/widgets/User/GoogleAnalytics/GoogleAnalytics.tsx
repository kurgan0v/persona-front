"use client";
import Script from "next/script";

export function GoogleAnalytics() {
    return(
        <>
            <Script
                strategy='lazyOnload'
                src={`https://www.googletagmanager.com/gtag/js?id=G-XYY9FZT2PE`}
            />

            <Script id='' strategy='lazyOnload'>
                {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XYY9FZT2PE', {
              page_path: window.location.pathname,
              });
          `}
            </Script>
        </>
    )
}
