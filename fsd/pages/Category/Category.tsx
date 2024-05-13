import s from './Category.module.scss';
import Catalog from "@/fsd/widgets/User/Catalog/Catalog";
export default function Category({params}:{params: { category: string , section: string}}){
    return(
       <div className={s.wrapper}>
           <Catalog category={params.category} section={params.section}/>
       </div>
    )
}
