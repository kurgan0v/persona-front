import s from './MainPage.module.scss';
import Logo from '@/fsd/shared/ui/Logo/Logo';
import MainSections from "@/fsd/widgets/User/MainSections/MainSections";

const MainPage = () => {
    return (
        <div className={s.wrapper}>
            <MainSections/>
        </div>
    );
};

export default MainPage;
