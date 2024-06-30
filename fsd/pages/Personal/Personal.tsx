"use client";
import s from './Personal.module.scss';
import RequestWidget from "@/fsd/widgets/User/RequestWidget/RequestWidget";
import {useState} from "react";
import ClothesTypes from "@/fsd/widgets/User/Personal/ClothesTypes/ClothesTypes";
import Steps from "@/fsd/widgets/User/Personal/Steps/Steps";
import OurWorks from "@/fsd/widgets/User/Personal/OurWorks/OurWorks";
import Advantages from "@/fsd/widgets/User/Personal/Advantages/Advantages";
import PersonalHeader from "@/fsd/widgets/User/Personal/PersonalHeader/PersonalHeader";
import CTA from "@/fsd/widgets/User/Personal/CTA/CTA";

const products = [
    {
        id: 0,
        image: '/personal/product1.jpg',
        text: 'Пошив вечерних и коктейльных платьев'
    },
    {
        id: 1,
        image: '/personal/product2.jpg',
        text: 'Пошив деловых и вечерних костюмов'
    },
    {
        id: 2,
        image: '/personal/product3.jpg',
        text: 'Пошив повседневной одежды, аксессуаров'
    },
    {
        id: 3,
        image: '/personal/product4.jpg',
        text: 'Пошив нестандартной и уникальной одежды'
    }
]
const advantages = [
    {
        id: 0,
        title: 'Удобной',
        image: '/personal/card1.jpg',
        description: 'Мы снимаем все мерки и несколько раз дорабатываем модель, чтобы одежда не сковывала движения и была комфортной'
    },
    {
        id: 1,
        title: 'Уникальной',
        image: '/personal/card2.jpg',
        description: 'Каждая модель создается под ваш запрос. Мы учитываем все ваши пожелания по посадке, крою и внешнему виду изделия'
    },
    {
        id: 2,
        title: 'Долговечной',
        image: '/personal/card3.jpg',
        description: 'Мы используем премиальный текстиль, уделяем внимание каждому шву и каждому фурнитурному элементу'
    }
]


export default function Personal(){
    const [modal, setModal] = useState(false);
    return (
        <div className={s.wrapper}>
            <PersonalHeader setModal={setModal}/>
            <ClothesTypes products={products} wrapperClass={s.block}/>
            <Advantages advantages={advantages} wrapperClass={s.block}/>
            <Steps wrapperClass={s.block}/>
            <OurWorks wrapperClass={s.block}/>
            <CTA setModal={setModal}/>
            <RequestWidget modal={modal} setModal={setModal} type={0}/>
        </div>
    )
}
