"use client";
import s from './ProductSlider.module.scss';
import {Swiper, SwiperSlide} from "swiper/react";
import { type Swiper as SwiperRef } from 'swiper'
import ProductCard from "@/fsd/entities/product/components/ProductCard/ProductCard";
import ButtonRound from "@/fsd/shared/ui/ButtonRound/ButtonRound";
import {useRef} from "react";
import {IProduct, IProductDetail, IProductWithSection} from "@/fsd/entities/product/model";
import Arrow from "@/fsd/shared/ui/icons/Arrow/Arrow";

interface ProductSliderProps{
    title: string
    products: IProductDetail[]
}
export function ProductSlider ({title, products}:ProductSliderProps){
    const swiperRef = useRef<SwiperRef>();
    return (
        <div className={s.wrapper}>
            <div className={s.header}>
                <h2>{title}</h2>
                <div className={s.arrows}>
                    <ButtonRound onClick={()=>swiperRef.current?.slidePrev()}>
                        <Arrow className={s.prev}/>
                    </ButtonRound>
                    <ButtonRound onClick={()=>swiperRef.current?.slideNext()}>
                        <Arrow/>
                    </ButtonRound>
                </div>
            </div>
           <Swiper
               onSwiper={(swiper) => {
                   swiperRef.current = swiper;
               }}
               slidesPerView={1.1}
               spaceBetween={16}
               breakpoints={{
                   1200: {
                       slidesPerView: 4,
                       spaceBetween: 32
                   },
                   991: {
                       slidesPerView: 3
                   },
                   420:{
                       slidesPerView: 2
                   }
               }}
           >
               {products.map(p => <SwiperSlide key={p.id}>
                   <ProductCard product={p}/>
               </SwiperSlide>)}
           </Swiper>
        </div>
    );
}
