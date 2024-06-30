import s from './CTA.module.scss';
import {Button} from "antd";
import React from "react";

interface CTAProps{
    setModal: React.Dispatch<React.SetStateAction<boolean>>
}
export default function CTA({setModal}: CTAProps){
    return(
        <div className={s.final}>
            <h2>Создайте свой уникальный стиль</h2>
            <p>Оставьте заявку, чтобы рассчитать стоимость пошива</p>
            <Button type={'primary'} onClick={()=>setModal(true)}>Оставить заявку</Button>
        </div>
    )
}
