"use client";
import s from './Personal.module.scss';
import Image from 'next/image';
import RequestWidget from "@/fsd/widgets/User/RequestWidget/RequestWidget";
import { motion } from 'framer-motion';
import {container, item} from "@/fsd/app/const/framer-motion-options";
export default function Personal(){

    const images = [1, 2, 3, 4, 5, 6, 7, 8];
    return (
        <div className={s.wrapper}>
            <div className={s.info}>
                <h2>Индивидуальный пошив</h2>
                <p>Мы понимаем, что каждый клиент имеет свои индивидуальные предпочтения и потребности. Поэтому мы уделяем особое внимание каждой детали и работаем над созданием модели, которая будет отражать ваш стиль и подходить именно вам.</p>
                <RequestWidget/>
            </div>
            <motion.ul className={s.gallery} variants={container}
                       initial="hidden"
                       whileInView="visible" viewport={{ once: true }}>
                {images.map(i => (
                    <motion.li key={i} className={s.image} variants={item}>
                        <Image src={`/gallery/${i}.png`} alt={''} fill objectFit={'cover'}/>
                    </motion.li>
                ))}
            </motion.ul>
        </div>
    )
}
