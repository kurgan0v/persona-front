import Personal from "@/fsd/pages/Personal/Personal";
import {Metadata} from "next";


export async function generateMetadata(): Promise<Metadata> {
    const res = await fetch(`${process.env.APP_BASE_URL}/seo/metadata/personal`, { next: { revalidate: 0 } })
    try{
        return await res.json()
    } catch (e) {
        return {}
    }
}
export default function Page() {
    return (
        <>
            <Personal/>
        </>
    )
}
