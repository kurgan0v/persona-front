"use client";
import s from './PromoSlider.module.scss';
import {Swiper, SwiperSlide} from "swiper/react";
import { Pagination, Autoplay } from 'swiper/modules';
import PromoSlide from "@/fsd/entities/promo/components/PromoSlide/PromoSlide";
import {IPromo} from "@/fsd/entities/promo/model";
import { motion } from 'framer-motion';

export function PromoSlider ({promo}:{promo: IPromo[]})  {
    return (
        <motion.div className={s.wrapper} initial={{ opacity: 0, translateY: -20 }}
                    whileInView={{ opacity: 1, translateY: 0 }} transition={{duration: .3, ease: [0.22, 1, 0.36, 1]}}>
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
        </motion.div>
    );
};

