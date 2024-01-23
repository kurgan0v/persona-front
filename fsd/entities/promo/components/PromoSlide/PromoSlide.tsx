import s from './PromoSlide.module.scss';
import Link from "next/link";
import ButtonTransparent from "@/fsd/shared/ui/ButtonTransparent/ButtonTransparent";
import {IPromo} from "@/fsd/entities/promo/model";
import ArrowLong from "@/fsd/shared/ui/icons/ArrowLong/ArrowLong";
import CustomImage from "@/fsd/shared/ui/CustomImage/CustomImage";
interface PromoSlideProps{
    promo: IPromo
}
const PromoSlide:React.FC<PromoSlideProps> = ({promo}) => {
    return (
        <Link href={promo.link ? `/catalog/promo/${promo.link}` : ''}>
            <div className={s.slide}>
                <CustomImage className={s.image} src={promo.cover} alt={promo.title ?? ''} fill/>
                <div className={s.slideContent}>
                    {promo.title && <h2 className={s.title}>{promo.title}</h2>}
                    {promo.description && <p className={s.desc}>{promo.description}</p>}
                    {promo.showButton && <ButtonTransparent>
                        <div className={s.btn}>
                            <p>Подробнее</p>
                            <ArrowLong/>
                        </div>
                    </ButtonTransparent>}
                </div>
            </div>
        </Link>
    );
};

export default PromoSlide;
