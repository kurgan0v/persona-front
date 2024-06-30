import s from './Benefits.module.scss';
import CustomImage from "@/fsd/shared/ui/CustomImage/CustomImage";

interface BenefitsProps{
    wrapperClass: string
}
const benefits = [
    {
        id: 0,
        text: 'Широкий выбор премиальных тканей и материалов, которые обеспечивают комфорт при носке, долговечность и роскошный внешний вид вашего костюма',
        image: '/suits/benefit1.jpeg'
    },
    {
        id: 1,
        text: 'Мы проводим несколько этапов примерок и доработок, чтобы костюм сел по фигуре и соответствовал всем вашим требованиям',
        image: '/suits/benefit2.jpeg'
    }
]
export default function Benefits({wrapperClass}: BenefitsProps){
    return(
        <div className={wrapperClass}>
            <h2>Вы получите идеальный костюм</h2>
            <div className={s.benefits}>
                {benefits.map(el => (
                    <div className={s.benefit} key={el.id}>
                        <CustomImage webImage={true} fill src={el.image} alt={''}/>
                        <p>{el.text}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
