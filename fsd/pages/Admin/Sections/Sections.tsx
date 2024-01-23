import s from './Sections.module.scss';
import EditSections from "@/fsd/widgets/Admin/EditSections/EditSections";

export default function Sections() {
    return (
        <div className={s.wrapper}>
            <EditSections/>
        </div>
    )
}
