import React from "react";
import {motion} from "framer-motion";
import s from './SuitsHeader.module.scss';
import {container, item} from "@/fsd/app/const/framer-motion-options";
import {Button} from "antd";
import CustomImage from "@/fsd/shared/ui/CustomImage/CustomImage";

interface SuitsHeaderProps{
    setModal: React.Dispatch<React.SetStateAction<boolean>>
}
export default function SuitsHeader({setModal}: SuitsHeaderProps){
    return(
        <div className={s.wrapper}>
            <div className={s.content}>
                <div className={s.header}>
                    <h2>Индивидуальный пошив костюмов в Саратове</h2>
                    <p>Эксклюзивные костюмы на заказ для любого случая</p>
                </div>
                <div className={s.cta}>
                    <p>Оставьте заявку, чтобы рассчитать стоимость пошива</p>
                    <Button type={'primary'} onClick={()=>setModal(true)}>Оставить заявку</Button>
                </div>
            </div>
            <motion.ul className={s.suits} variants={container}
                       initial="hidden"
                       whileInView="visible" viewport={{ once: true }} >
                <motion.li className={s.imageWrapper} variants={item}>
                    <CustomImage className={s.image} webImage={true} height={1000} width={1000} src={'/suits/suit1.jpeg'} alt={''}/>
                </motion.li>
                <motion.li className={s.imageWrapper} variants={item}>
                    <CustomImage className={s.image} webImage={true} height={1000} width={1000} src={'/suits/suit2.jpeg'} alt={''}/>
                </motion.li>
                <motion.li className={s.imageWrapper} variants={item}>
                    <CustomImage className={s.image} webImage={true} height={1000} width={1000} src={'/suits/suit3.jpeg'} alt={''}/>
                </motion.li>
            </motion.ul>
        </div>
    )
}
