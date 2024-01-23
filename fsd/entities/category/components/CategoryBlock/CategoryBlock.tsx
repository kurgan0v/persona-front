'use client';
import Link from "next/link";
import {usePathname} from "next/navigation";
import s from "./CategoryBlock.module.scss";
import ButtonTransparent from "@/fsd/shared/ui/ButtonTransparent/ButtonTransparent";
import CustomImage from "@/fsd/shared/ui/CustomImage/CustomImage";
import {ICategory} from "@/fsd/entities/category/model";

interface CategoryMainProps {
    category: ICategory
}

const CategoryBlock: React.FC<CategoryMainProps> = ({category}) => {
    const pathname = usePathname()
    return (
        <div className={s.category}>
            <CustomImage className={s.image} src={category.cover} alt={''} fill/>
            <h2>{category.name}</h2>
            {category.text && <p>{category.text}</p>}
            <Link href={`${pathname}/${category.link}`}>
                <ButtonTransparent>
                    <div className={s.btn}>
                        <p>Подробнее</p>
                    </div>
                </ButtonTransparent>
            </Link>
        </div>

    );
};

export default CategoryBlock;
