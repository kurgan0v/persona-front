import s from './Categories.module.scss';
import CategoryBlock from "@/fsd/entities/category/components/CategoryBlock/CategoryBlock";
import Empty from "@/fsd/shared/ui/Empty/Empty";
import {ICategory} from "@/fsd/entities/category/model";
import { motion } from 'framer-motion';
import {container, item} from "@/fsd/app/const/framer-motion-options";

const Categories = ({categories}:{categories: ICategory[]}) => {
    return (
        <div className={s.wrapper} >
            {categories.length ? <motion.ul className={s.categories} variants={container}
                                            initial="hidden"
                                            whileInView="visible"  viewport={{ once: true, margin: '200px' }}>
                {
                    categories.map(c => (
                        <motion.li className={s.category} key={c.id} variants={item} ><CategoryBlock category={c}/></motion.li>
                    ))
                }
            </motion.ul> : <Empty title={'В этом разделе пока нет категорий'}/>}
        </div>
    );
};

export default Categories;
