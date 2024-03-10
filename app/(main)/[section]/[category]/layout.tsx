import {Metadata} from "next";
import {notFound} from "next/navigation";
type Props = {
    params: { category: string , section: string};
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const res = await fetch(`${process.env.APP_BASE_URL}/category/seo/${params.section}/${params.category}`, { next: { revalidate: 0 } })
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
