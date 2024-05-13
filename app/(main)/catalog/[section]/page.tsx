import CatalogPage from "@/fsd/pages/CatalogPage/CatalogPage";
import {notFound} from "next/navigation";
import {Suspense} from "react";

export default async function Page({ params }: { params: { section: string} }){
    const res = await fetch(`${process.env.APP_BASE_URL}/section/seo/${params.section}`, { next: { revalidate: 86400 } })
    if(res.status === 404){
        return notFound()
    }
    return(
        <Suspense>
            <CatalogPage section={params.section}/>
        </Suspense>
    )
}
