import s from './ProductCardBasic.module.scss';
import CustomImage from "@/fsd/shared/ui/CustomImage/CustomImage";
import {clsx} from "clsx";
import {IProduct, IProductDetail} from "@/fsd/entities/product/model";
export default function ProductCardBasic({product}:{product: IProductDetail}){
    return(
        <div className={clsx(s.card, product.sizes?.length === 0 && s.disabled)}>
            <div className={s.img}>
                <CustomImage src={product?.gallery?.length ? product.gallery[0] : ''} alt={product.title} fill/>
            </div>
            <div className={s.prices}>
                <p className={clsx(s.price, product.sale && s.oldPrice)}>{product.basic_price} ₽</p>
                {product.sale && <p className={clsx(s.price, s.newPrice)}>{product.sale_type === "percents" ? product.basic_price * (100 - product.sale)/100 : product.basic_price - product.sale} ₽</p>}
            </div>
            <p className={s.title}>{product.title}</p>
        </div>
    )
}
