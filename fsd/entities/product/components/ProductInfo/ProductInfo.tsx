"use client";
import s from "./ProductInfo.module.scss";
import {IProductDetail} from "@/fsd/entities/product/model";
import ProductForm from "@/fsd/features/ProductForm/ProductForm";
import CustomImage from "@/fsd/shared/ui/CustomImage/CustomImage";
import ButtonRound from "@/fsd/shared/ui/ButtonRound/ButtonRound";
import Arrow from "@/fsd/shared/ui/icons/Arrow/Arrow";
import {useEffect, useRef, useState} from "react";
import {clsx} from "clsx";
import {
    SideBySideMagnifier
} from "@ricarso/react-image-magnifiers";
import {sendGTMEvent} from "@next/third-parties/google";


interface ProductInfoProps {
    product: IProductDetail
}

export default function ProductInfo({product}: ProductInfoProps) {
    useEffect(() => {
        sendGTMEvent({
            event: 'view_item',
            ecommerce: {
                items: [{
                    item_id: product.id,
                    item_name: product.title,
                    item_category: product.category?.name,
                    item_section: product.category?.section.name,
                }]
            }
        })
    }, [])
    const screenWidth = useRef(window.screen.width)
    const [currentImage, setCurrentImage] = useState(0);
    return (
        <div className={s.wrapper}>
            <div className={s.galleryWrapper}>
                <div className={s.wrapMagnifier}>
                    <SideBySideMagnifier inPlaceMinBreakpoint={576}
                                         imageSrc={(product.gallery && product.gallery[currentImage]) ? /https/.test(product.gallery[currentImage]) ? product.gallery[currentImage] : `${process.env.APP_BASE_URL}/files/${product.gallery[currentImage]}` : '/placeholder.svg'}
                                         imageAlt={product.title}
                    />
                </div>
                <div className={s.gallery}>
                    {product.gallery ? product.gallery.slice(0, 3).map((img, i) => (
                        <div className={clsx(s.galleryImage, (currentImage === i) && s.active)} key={img}
                             onClick={() => {
                                 setCurrentImage(i)
                             }}>
                            <CustomImage src={img} alt={''} fill/>
                        </div>
                    )) : <div className={clsx(s.galleryImage)}>
                        <CustomImage src={''} alt={''} fill/>
                    </div>}
                    <div className={s.arrows}>
                        <ButtonRound
                            onClick={() => setCurrentImage(prev => prev - 1 < 0 ? product.gallery.length - 1 : prev - 1)}>
                            <Arrow className={s.prev}/>
                        </ButtonRound>
                        <ButtonRound
                            onClick={() => setCurrentImage(prev => prev + 1 >= product.gallery.length ? 0 : prev + 1)}>
                            <Arrow/>
                        </ButtonRound>
                    </div>
                    {product.gallery && product.gallery.slice(3).map((img, i) => (
                        <div className={clsx(s.galleryImage, (currentImage === i + 3) && s.active)} key={img}
                             onClick={() => {
                                 setCurrentImage(i + 3)
                             }}>
                            <CustomImage src={img} alt={''} fill/>
                        </div>
                    ))}
                </div>
            </div>
            <div className={s.info}>
                <h2>{product.title}</h2>
                {(product.description || product.characteristics.length > 0) && <div className={s.characteristics}>
                    {product.description && <div className={s.characteristic}>
                        <h3>Описание</h3>
                        <p>{product.description}</p>
                    </div>}
                    {product.characteristics.sort((ch1, ch2) => ch1.characteristics_type.name.localeCompare(ch2.characteristics_type.name, 'ru', {sensitivity: 'base'})).map(ch => (
                        <div key={ch.id} className={s.characteristic}>
                            <h3>{ch.characteristics_type.name}</h3>
                            <p>{ch.name}</p>
                        </div>
                    ))}
                </div>}
                <ProductForm product={product}/>
            </div>
        </div>
    )
}
