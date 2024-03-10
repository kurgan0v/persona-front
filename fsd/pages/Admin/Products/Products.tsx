import ProductsList from "@/fsd/widgets/Admin/ProductsList/ProductsList";
import s from './Products.module.scss';
import {Suspense} from "react";
type Params = {
    params?: {category?: string
        section?: string}
}
export default function Products({params}: Params){
    return(
        <div className={s.wrapper}>
            <Suspense>
                <ProductsList params={params}/>
            </Suspense>
        </div>
    )
}
