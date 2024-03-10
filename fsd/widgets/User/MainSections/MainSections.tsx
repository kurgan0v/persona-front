"use client";
import s from "./MainSections.module.scss";
import SectionMain from "@/fsd/entities/section/components/SectionMain/SectionMain";
import {useQuery} from "react-query";
import {SectionsFetcher} from "@/fsd/shared/api/section";
import { motion } from "framer-motion";
import {container} from "@/fsd/app/const/framer-motion-options";




export default function MainSections(){
    const {data: sections, isSuccess} = useQuery(['sections'], SectionsFetcher);
    return(
        <>
            {isSuccess && <motion.ul
                className={s.sections}
                variants={container}
                initial="hidden"
                animate="visible"
            >{sections.filter(el => el.is_main).map(section => (
                <SectionMain section={section} key={section.id}/>
            ))}</motion.ul>}

        </>
    )
}
