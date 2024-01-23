import Header from "@/fsd/widgets/User/Header/Header";
import Footer from "@/fsd/widgets/User/Footer/Footer";
import s from './UserLayout.module.scss';
export default function UserLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}){
    return(
        <div className={s.wrapper}>
            <Header/>
            <div className={s.content}>
                {children}
            </div>
            <Footer/>
        </div>
    )
}
