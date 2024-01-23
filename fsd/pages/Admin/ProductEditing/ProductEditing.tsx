import s from './ProductEditing.module.scss';
import EditProduct from "@/fsd/widgets/Admin/EditProduct/EditProduct";

export default function ProductEditing({id}:{id: string}){
    return(
        <div className={s.wrapper}>
            <EditProduct id={id}/>
        </div>
    )
}
