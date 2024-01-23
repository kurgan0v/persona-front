import s from './Categories.module.scss';
import EditCategories from "@/fsd/widgets/Admin/EditCategories/EditCategories";

export default function Categories() {
    return (
        <div className={s.wrapper}>
            <EditCategories/>
        </div>
    )
}
