import s from './PersonalHeader.module.scss';
import CustomImage from "@/fsd/shared/ui/CustomImage/CustomImage";
import ButtonTransparent from "@/fsd/shared/ui/ButtonTransparent/ButtonTransparent";
import React from "react";

interface PersonalHeaderProps{
    setModal: React.Dispatch<React.SetStateAction<boolean>>
}
export default function PersonalHeader({setModal}: PersonalHeaderProps){
    return(
        <div className={s.header}>
            <CustomImage webImage={true} fill src={'/personal/header.jpg'} alt={'Индивидуальный пошив одежды в Саратове'}/>
            <div className={s.headerTitle}>
                <h1>Индивидуальный пошив одежды в Саратове</h1>
                <p>Создайте свой уникальный стиль</p>
            </div>
            <div className={s.cta}>
                <p>Оставьте заявку, чтобы рассчитать стоимость пошива</p>
                <ButtonTransparent onClick={()=>setModal(true)}>Оставить заявку</ButtonTransparent>
            </div>
        </div>
    )
}
