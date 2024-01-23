import s from "./ModalInfo.module.scss";
import Image from "next/image";
import {IInfo} from "@/fsd/entities/info/model";
import CustomImage from "@/fsd/shared/ui/CustomImage/CustomImage";

export default function ModalInfo({info}:{info: IInfo}){
    return(
        <div className={s.modalWrapper}>
            {info.cover && <div className={s.modalImg}>
                <CustomImage src={info.cover} alt={info.name} fill/>
            </div>}
            <div>
                <h2>{info.name}</h2>
                {info.text.split('\n').map((t, i) => (<p key={i}>{t}<br/></p>))}
            </div>
        </div>
    )
}
