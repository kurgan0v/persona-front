import s from './SectionMain.module.scss';
import {ISectionView} from "@/fsd/entities/section/model";
import Link from "next/link";
import React from "react";
import CustomImage from "@/fsd/shared/ui/CustomImage/CustomImage";
import { motion } from 'framer-motion';
import {item} from "@/fsd/app/const/framer-motion-options";

interface SectionMainProps {
    section: ISectionView
}


const SectionMain: React.FC<SectionMainProps> = ({section}) => {
    return (
        <>
            {!section.is_uni ? <motion.li variants={item} className={s.animateWrapper}><Link href={section.link} className={s.wrapper}>
                    <h2>{section.name}</h2>
                    {section.cover && <CustomImage src={section.cover} className={s.img} alt={section.name} fill/>}
                </Link></motion.li> :
                <div className={s.wrapperSub}>
                    {section.sections.map(sec => (
                        <motion.li variants={item} className={s.animateWrapper} key={sec.id}><Link href={sec.link ?? ''} className={s.wrapper} >
                            <h2>{sec.name}</h2>
                            {sec.cover && <CustomImage src={sec.cover} className={s.img} alt={sec.name} fill/>}
                        </Link></motion.li>
                    ))}
                </div>}

                </>
    );
};

export default SectionMain;
