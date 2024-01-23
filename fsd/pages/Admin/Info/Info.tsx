import s from './Info.module.scss';
import InfoList from "@/fsd/widgets/Admin/InfoList/InfoList";

export default function Info() {
    return (
        <div className={s.wrapper}>
            <h2>Информация для покупателей</h2>
            <InfoList/>
        </div>
    )
}
