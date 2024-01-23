import s from './PromoBlock.module.scss';
import CustomImage from "@/fsd/shared/ui/CustomImage/CustomImage";
import {IPromo} from "@/fsd/entities/promo/model";
import Delete from "@/fsd/features/Delete/Delete";
import EditIcon from "@/fsd/shared/ui/icons/EditIcon/EditIcon";

interface PromoBlockProps{
    promo: IPromo
    onDeleteClick: ()=>void
    onEditClick: ()=>void
}
export default function PromoBlock({promo, onDeleteClick, onEditClick}: PromoBlockProps){
    return(
        <div className={s.wrapper}>
            <div className={s.img}>
                <CustomImage src={promo.cover} alt={''} fill/>
            </div>
            <div className={s.content}>
                <div className={s.header}>
                    <h3>{promo.title}</h3>
                    <p>{promo.description}</p>
                </div>
                <p>{promo.link ? `/${promo.link}` : 'Ссылка не указана'}</p>
            </div>
            <div className={s.buttons}>
                <Delete onConfirm={onDeleteClick} description={'Вы уверены, что хотите удалить промо-акцию?'}/>
                <EditIcon onClick={onEditClick}/>
            </div>
        </div>
    )
}
