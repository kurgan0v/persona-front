import CatalogPage from "@/fsd/pages/CatalogPage/CatalogPage";
import {Suspense} from "react";

export default function Page(){
    return(
        <Suspense>
            <CatalogPage/>
        </Suspense>
    )
}
