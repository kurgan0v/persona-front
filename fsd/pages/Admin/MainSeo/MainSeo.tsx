import s from './MainSeo.module.scss';
import MainSeoForm from "@/fsd/widgets/Admin/MainSeoForm/MainSeoForm";

export default function MainSeo() {
    return (
        <div className={s.wrapper}>
            <h2>Настройки SEO</h2>
            <p>Эти данные будут использоваться для индексации главной страницы и в случае, если на странице не заданы отдельные настройки</p>
            <MainSeoForm/>
        </div>
    )
}
