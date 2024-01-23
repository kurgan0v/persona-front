import s from './Categories.module.scss';
import CategoryBlock from "@/fsd/entities/category/components/CategoryBlock/CategoryBlock";
import Empty from "@/fsd/shared/ui/Empty/Empty";
import {ICategory} from "@/fsd/entities/category/model";
const Categories = ({categories}:{categories: ICategory[]}) => {
    return (
        <div className={s.wrapper}>
            {categories.length ? <div className={s.categories}>
                {
                    categories.map(c => (
                        <div className={s.category} key={c.id}>
                            <CategoryBlock category={c}/>
                        </div>
                    ))
                }
            </div> : <Empty title={'В этом разделе пока нет категорий'}/>}
        </div>
    );
};

export default Categories;
