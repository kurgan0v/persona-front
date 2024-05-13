import CatalogPage from "@/fsd/pages/CatalogPage/CatalogPage";
import {Suspense} from "react";

export default function Page({params}:{params: {promo: string}}){
    return(
        <Suspense>
            <CatalogPage promo={params.promo}/>
        </Suspense>
    )
}
