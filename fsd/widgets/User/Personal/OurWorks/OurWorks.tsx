import s from './OurWorks.module.scss';
import {Swiper, SwiperSlide} from "swiper/react";
import CustomImage from "@/fsd/shared/ui/CustomImage/CustomImage";
import {useRef} from "react";
import {Swiper as SwiperRef} from "swiper";
const images = [
    {
        id: 0,
        image: '/personal/clothes/photo1.png'
    },
    {
        id: 1,
        image: '/personal/clothes/photo2.png'
    },
    {
        id: 2,
        image: '/personal/suits/photo1.jpg'
    },
    {
        id: 3,
        image: '/personal/suits/photo2.png'
    },
    {
        id: 4,
        image: '/personal/suits/photo3.png'
    },
    {
        id: 5,
        image: '/personal/suits/photo4.png'
    },
    {
        id: 6,
        image: '/personal/suits/photo5.png'
    },
    {
        id: 7,
        image: '/personal/suits/photo6.png'
    },
]
interface OurWorksProps {
    wrapperClass: string
}
export default function OurWorks({wrapperClass}: OurWorksProps){
    const swiperRef = useRef<SwiperRef>();
    return(
        <div className={wrapperClass}>
            <h2>Наши работы</h2>
            <div className={s.cases}>
                <Swiper
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    slidesPerView={1.1}
                    spaceBetween={16}
                    initialSlide={2}
                    loop={true}
                    breakpoints={{
                        1200: {
                            slidesPerView: 3,
                            spaceBetween: 24
                        },
                        991: {
                            slidesPerView: 2
                        },
                        420:{
                            slidesPerView: 1.5
                        }
                    }}
                >
                    {images.map(img => <SwiperSlide key={img.id}>
                        <div className={s.case}>
                            <CustomImage webImage={true} fill src={img.image} alt={''}/>
                        </div>
                    </SwiperSlide>)}
                </Swiper>
            </div>
        </div>
    )
}
