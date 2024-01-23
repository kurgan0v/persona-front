import s from './SectionAdmin.module.scss';
import CustomImage from "@/fsd/shared/ui/CustomImage/CustomImage";
import EditIcon from "@/fsd/shared/ui/icons/EditIcon/EditIcon";
import {ISection} from "@/fsd/entities/section/model";

interface SectionAdminProps{
    section: ISection
    onEditClick: () => void
}
export default function SectionAdmin({section, onEditClick}: SectionAdminProps){
    return(
        <div key={section.id} className={s.section}>
            {section.cover && <div className={s.cover}><CustomImage src={section.cover} alt={''} fill/></div>}
            <div className={s.content}>
                <h3>{section.name}</h3>
                <p>/{section.link}</p>
            </div>
            <div className={s.buttons}>
                <EditIcon onClick={onEditClick}/>
            </div>
        </div>
    )
}
