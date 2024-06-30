import {motion} from "framer-motion";
import {container, item} from "@/fsd/app/const/framer-motion-options";
import CustomImage from "@/fsd/shared/ui/CustomImage/CustomImage";
import s from './ClothesTypes.module.scss';
interface ClothesTypesProps {
    products: {
        id: number,
        image: string,
        text: string
    }[]
    wrapperClass: string
}
export default function ClothesTypes({products, wrapperClass}: ClothesTypesProps){
    return(
        <div className={wrapperClass}>
            <h2>Что мы делаем для вас?</h2>
            <motion.ul className={s.products} variants={container}
                       initial="hidden"
                       whileInView="visible" viewport={{ once: true }}>
                {products && products.map((p)=> (
                    <motion.li className={s.product} key={p.id} variants={item}>
                        <div className={s.productImage}>
                            <CustomImage webImage={true} src={p.image} fill alt={''}/>
                        </div>
                        <p>{p.text}</p>
                    </motion.li>
                ))}
            </motion.ul>
        </div>
    )
}
