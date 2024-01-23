import s from './Empty.module.scss';
import Hanger from "@/fsd/shared/ui/icons/Hanger/Hanger";

export default function Empty({title}:{title: string}){
    return(
        <div className={s.wrapper}>
            <Hanger/>
            <h3 className={s.title}>{title}</h3>
        </div>
    )
}
