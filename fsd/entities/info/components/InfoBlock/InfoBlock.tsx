import s from './InfoBlock.module.scss';
import CustomImage from "@/fsd/shared/ui/CustomImage/CustomImage";
import {IInfo} from "@/fsd/entities/info/model";
import EditIcon from "@/fsd/shared/ui/icons/EditIcon/EditIcon";

interface InfoBlockProps {
    info: IInfo
    onEditClick: ()=>void
}
export default function InfoBlock({info, onEditClick}:InfoBlockProps){
    return(
        <div className={s.wrapper}>
            <div className={s.img}>
                <CustomImage src={info.cover} alt={info.name} fill/>
            </div>
            <div className={s.content}>
                <div className={s.header}>
                    <h3>{info.name}</h3>
                    {info.text.split('\n').map((t, i) => (<p key={i}>{t}<br/></p>))}
                </div>
            </div>
            <div className={s.buttons}>
                <EditIcon onClick={onEditClick}/>
            </div>
        </div>
    )
}
