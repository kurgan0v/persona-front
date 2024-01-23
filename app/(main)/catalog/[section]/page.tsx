import CatalogPage from "@/fsd/pages/CatalogPage/CatalogPage";

export default function Page({ params }: { params: { section: string} }){
    return(
        <>
            <CatalogPage section={params.section}/>
        </>
    )
}
