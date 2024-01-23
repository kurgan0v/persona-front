import CatalogPage from "@/fsd/pages/CatalogPage/CatalogPage";

export default function Page({params}:{params: {promo: string}}){
    return(
        <>
            <CatalogPage promo={params.promo}/>
        </>
    )
}
