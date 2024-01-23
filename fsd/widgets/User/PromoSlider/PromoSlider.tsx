"use client";
import s from './PromoSlider.module.scss';
import {Swiper, SwiperSlide} from "swiper/react";
import { Pagination, Autoplay } from 'swiper/modules';
import PromoSlide from "@/fsd/entities/promo/components/PromoSlide/PromoSlide";
import {IPromo} from "@/fsd/entities/promo/model";
export function PromoSlider ({promo}:{promo: IPromo[]})  {
    return (
        <div className={s.wrapper}>
            <Swiper
                modules={[Pagination, Autoplay]}
                pagination={{ clickable: true }}
                autoplay={{
                    delay: 10000
                }}
                slidesPerView={1}

            >
                {promo.map(p => (
                    <SwiperSlide key={p.id}>
                        <PromoSlide promo={p}/>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

