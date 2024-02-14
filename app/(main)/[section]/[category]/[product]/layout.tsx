import {Metadata} from "next";
import {notFound} from "next/navigation";
type Props = {
    params: { category: string , section: string, product: string};
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const res = await fetch(`${process.env.APP_BASE_URL}/product/seo/${params.product}`, { next: { revalidate: 86400 } })
    if(res.status === 404){
        return notFound()
    }
    try{
        return await res.json()
    } catch (e) {
        return {}
    }
}
export default function Layout({children}: {children: React.ReactNode}) {
    return (
            <>{children}</>
    )
}
