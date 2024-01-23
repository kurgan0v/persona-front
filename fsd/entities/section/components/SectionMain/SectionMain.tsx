import s from './SectionMain.module.scss';
import {ISectionView} from "@/fsd/entities/section/model";
import Link from "next/link";
import React from "react";
import CustomImage from "@/fsd/shared/ui/CustomImage/CustomImage";

interface SectionMainProps {
    section: ISectionView
}

const SectionMain: React.FC<SectionMainProps> = ({section}) => {
    return (
        <>
            {section.link ? <Link href={section.link} className={s.wrapper}>
                    <h2>{section.name}</h2>
                    {section.cover && <CustomImage src={section.cover} className={s.img} alt={section.name} fill/>}
                </Link> :
                <div className={s.wrapperSub}>
                    {section.sections.map(sec => (
                        <Link href={sec.link ?? ''} className={s.wrapper} key={sec.id}>
                            <h2>{sec.name}</h2>
                            {sec.cover && <CustomImage src={sec.cover} className={s.img} alt={sec.name} fill/>}
                        </Link>
                    ))}
                </div>}
        </>
    );
};

export default SectionMain;
