import Link from "next/link";
import s from './Detail.module.scss';
import {Breadcrumb} from "antd";
import ProductDetail from "@/fsd/widgets/User/ProductDetail/ProductDetail";
export default function ProductPage({productId}:{productId: string}) {
    return (
        <div className={s.wrapper}>
            <ProductDetail productId={productId}/>
        </div>
    )
}
