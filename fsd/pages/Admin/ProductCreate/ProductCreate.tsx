import s from './ProductCreate.module.scss';
import CreateProduct from "@/fsd/widgets/Admin/CreateProduct/CreateProduct";

export default function ProductCreate(){
    return(
        <div className={s.wrapper}>
            <h2>Создать товар</h2>
            <CreateProduct/>
        </div>
    )
}
