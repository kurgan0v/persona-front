import s from './Steps.module.scss';
import {container, item} from "@/fsd/app/const/framer-motion-options";
import {motion} from "framer-motion";
import CustomImage from "@/fsd/shared/ui/CustomImage/CustomImage";

const steps = [
    {
        id: 0,
        text: 'Консультация и снятие мерок',
        image: '/personal/icons/measurements.svg'
    },
    {
        id: 1,
        text: 'Выбор материалов и дизайна',
        image: '/personal/icons/textile.svg'
    },
    {
        id: 2,
        text: 'Создание выкройки изделия',
        image: '/personal/icons/pattern.svg'
    },
    {
        id: 3,
        text: 'Первый примерочный этап',
        image: '/personal/icons/fitting.svg'
    },
    {
        id: 4,
        text: 'Доработка и финальная примерка',
        image: '/personal/icons/revision.svg'
    },
    {
        id: 5,
        text: 'Окончательная обработка и сдача',
        image: '/personal/icons/final.svg'
    }
]

interface StepsProps{
    wrapperClass: string
}
export default function Steps({wrapperClass}: StepsProps){
    return(
        <div className={wrapperClass}>
            <h2>Как происходит пошив?</h2>
            <motion.ul className={s.steps} variants={container}
                       initial="hidden"
                       whileInView="visible" viewport={{ once: true }}>
                {steps.map(el => (
                    <motion.li className={s.step} key={el.id} variants={item}>
                        <CustomImage webImage={true} width={50} height={50} src={el.image} alt={el.text + ' иконка'}/>
                        <p>{el.text}</p>
                    </motion.li>
                ))}
            </motion.ul>
        </div>
    )
}
