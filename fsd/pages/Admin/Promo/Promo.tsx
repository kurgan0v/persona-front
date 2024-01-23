import s from './Promo.module.scss';
import EditPromo from "@/fsd/widgets/Admin/EditPromo/EditPromo";

export default function Promo() {
    return (
        <div className={s.wrapper}>
            <EditPromo/>
        </div>
    )
}
