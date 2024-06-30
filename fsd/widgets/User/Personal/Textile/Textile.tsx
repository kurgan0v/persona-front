import s from './Textile.module.scss';
import CustomImage from "@/fsd/shared/ui/CustomImage/CustomImage";
interface TextileProps{
    wrapperClass: string
}

const textiles = [
    {
        id: 0,
        image: '/suits/textile/svg/zegna.svg',
        country: 'Италия'
    },
    {
        id: 2,
        image: '/suits/textile/svg/dormeuil.svg',
        country: 'Франция'
    },
    {
        id: 3,
        image: '/suits/textile/svg/cerruti.svg',
        country: 'Франция'
    },
    {
        id: 1,
        image: '/suits/textile/svg/scabal.svg',
        country: 'Бельгия'
    },
]
export default function Textile({wrapperClass}: TextileProps){
    return(
        <div className={wrapperClass}>
            <h2>Премиальный текстиль для вашего образа</h2>
            <div className={s.textiles}>
                {textiles.map(el => (
                    <div className={s.textile} key={el.id}>
                        <CustomImage className={s.image} style={{objectFit: 'contain'}} width={250} height={43} webImage={true} src={el.image} alt={''}/>
                        <p>{el.country}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
