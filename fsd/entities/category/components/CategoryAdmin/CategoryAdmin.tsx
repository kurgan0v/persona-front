import s from './CategoryAdmin.module.scss';
import CustomImage from "@/fsd/shared/ui/CustomImage/CustomImage";
import EditIcon from "@/fsd/shared/ui/icons/EditIcon/EditIcon";
import {clsx} from "clsx";
import Delete from "@/fsd/features/Delete/Delete";
import {ICategory} from "@/fsd/entities/category/model";

interface SectionAdminProps{
    category: ICategory
    onEditClick: () => void
    onDeleteClick: () => void
}
export default function CategoryAdmin({category, onEditClick, onDeleteClick}: SectionAdminProps){
    return(
        <div className={clsx(s.section, !category.visible && s.hidden)}>
            {category.cover && <div className={s.cover}><CustomImage src={category.cover} alt={''} fill/></div>}
            <div className={s.content}>
                <h3>{category.name}</h3>
                <p>/{category.link}</p>
            </div>
            <div className={s.buttons}>
                <Delete onConfirm={onDeleteClick} description={'Вы уверены, что хотите удалить категорию?'}/>
                <EditIcon onClick={onEditClick}/>
            </div>
        </div>
    )
}
