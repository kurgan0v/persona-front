import s from './Advantages.module.scss';
import {motion} from "framer-motion";
import {container, item} from "@/fsd/app/const/framer-motion-options";
import CustomImage from "@/fsd/shared/ui/CustomImage/CustomImage";

interface AdvantagesProps {
    wrapperClass: string
    advantages: {
        id: number
        image: string
        title: string
        description: string
    }[]
}
export default function Advantages({wrapperClass, advantages}: AdvantagesProps){
    return(
        <div className={wrapperClass}>
            <h2>Ваша одежда получится</h2>
            <motion.ul className={s.advantages} variants={container}
                       initial="hidden"
                       whileInView="visible" viewport={{ once: true }}>
                {advantages.map(el => (
                    <motion.li className={s.advantage} key={el.id} variants={item}>
                        <div className={s.advantageImage}>
                            <CustomImage webImage={true} src={el.image} alt={el.title} fill/>
                            <h2>{el.title}</h2>
                        </div>
                        <p>{el.description}</p>
                    </motion.li>
                ))}
            </motion.ul>
        </div>
    )
}
