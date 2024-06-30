"use client";
import s from './Suits.module.scss';
import RequestWidget from "@/fsd/widgets/User/RequestWidget/RequestWidget";
import {useState} from "react";
import ClothesTypes from "@/fsd/widgets/User/Personal/ClothesTypes/ClothesTypes";
import Steps from "@/fsd/widgets/User/Personal/Steps/Steps";
import OurWorks from "@/fsd/widgets/User/Personal/OurWorks/OurWorks";
import CTA from "@/fsd/widgets/User/Personal/CTA/CTA";
import SuitsHeader from "@/fsd/widgets/User/Personal/SuitsHeader/SuitsHeader";
import Benefits from "@/fsd/widgets/User/Personal/Benefits/Benefits";
import Textile from "@/fsd/widgets/User/Personal/Textile/Textile";

const products = [
    {
        id: 0,
        image: '/suits/card1.jpg',
        text: 'Индивидуальный пошив деловых костюмов'
    },
    {
        id: 1,
        image: '/suits/card2.png',
        text: 'Свадебные и вечерние костюмы'
    },
    {
        id: 2,
        image: '/suits/card3.png',
        text: 'Костюмы для особых мероприятий'
    },
    {
        id: 3,
        image: '/suits/card4.png',
        text: 'Отдельные элементы костюма и аксессуары'
    }
]



export default function Personal(){
    const [modal, setModal] = useState(false);
    return (
        <div className={s.wrapper}>
            <SuitsHeader setModal={setModal}/>
            <ClothesTypes products={products} wrapperClass={s.block}/>
            <Benefits wrapperClass={s.block}/>
            <Textile wrapperClass={s.block}/>
            <Steps wrapperClass={s.block}/>
            <OurWorks wrapperClass={s.block}/>
            <CTA setModal={setModal}/>
            <RequestWidget modal={modal} setModal={setModal} type={2}/>
        </div>
    )
}
