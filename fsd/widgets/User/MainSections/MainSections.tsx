"use client";
import s from "./MainSections.module.scss";
import SectionMain from "@/fsd/entities/section/components/SectionMain/SectionMain";
import {useQuery} from "react-query";
import {SectionsFetcher} from "@/fsd/shared/api/section";

export default function MainSections(){
    const {data: sections, isSuccess} = useQuery(['sections'], () => SectionsFetcher());
    return(
        <div className={s.sections}>
            {isSuccess && sections.filter(el => el.is_main).map(section => (
                <SectionMain section={section} key={section.id}/>
            ))}
        </div>
    )
}
