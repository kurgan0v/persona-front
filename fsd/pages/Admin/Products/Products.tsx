import ProductsList from "@/fsd/widgets/Admin/ProductsList/ProductsList";
import s from './Products.module.scss';
export default function Products(){
    return(
        <div className={s.wrapper}>
            <ProductsList/>
        </div>
    )
}
