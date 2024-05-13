import s from './CatalogPage.module.scss';
import Catalog from "@/fsd/widgets/User/Catalog/Catalog";
export default function CatalogPage({section, promo}:{section?: string, promo?: string}){
    return(
       <div className={s.wrapper}>
           <Catalog section={section} promo={promo}/>
       </div>
    )
}
