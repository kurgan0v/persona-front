import s from './Requests.module.scss';
import RequestsList from "@/fsd/widgets/Admin/RequestsList/RequestsList";
export default function Requests() {
    return (
        <div className={s.wrapper}>
            <h2>Заявки на пошив</h2>
            <RequestsList/>
        </div>
    )
}
