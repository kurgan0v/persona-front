import s from './ProductCardBasic.module.scss';
import CustomImage from "@/fsd/shared/ui/CustomImage/CustomImage";
import {clsx} from "clsx";
import {IProductDetail} from "@/fsd/entities/product/model";

export default function ProductCardBasic({product}: { product: IProductDetail }) {
    const price = product.minPrice
        ? product.minPrice || 1
        : product.basic_price
    const salePrice = product.sale
        ? product.sale_type === 1
            ? (price * (100 - product.sale) / 100)
            : (price - product.sale)
        : 0;
    return (
        <div className={clsx(s.card)}>
            <div className={s.img}>
                <CustomImage src={product?.gallery?.length ? product.gallery[0] : ''} alt={product.title} fill/>
            </div>
            <div className={s.prices}>
                {product.minPrice !== product.maxPrice && 'от '}
                {product.sale && <span className={s.oldPrice}>{price.toLocaleString()} ₽</span>}
                <span className={clsx(product.sale && s.newPrice)}>{product.sale ? salePrice.toLocaleString() : price.toLocaleString()} ₽</span>
            </div>
            <p className={s.title}>{product.title}</p>
        </div>
    )
}
