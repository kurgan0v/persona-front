import {useEffect, useState} from "react";
import {ICartItem} from "@/fsd/entities/cartItem/model";
import {useMutation} from "react-query";
import {GetProductsByIds} from "@/fsd/shared/api/products";
import {IProductDetail} from "@/fsd/entities/product/model";

export const useCartTotal = (items?:ICartItem[]) => {
    const [total, setTotal] = useState(0);
    const [count, setCount] = useState(0);
    const [products, setProducts] = useState<IProductDetail[]>();
    const {mutateAsync: getCartItems, isSuccess} = useMutation(GetProductsByIds);
    useEffect(() => {
        if(items?.length){
            const ids = new Set(items.map(el => el.product_id))
            getCartItems(Array.from(ids)).then((res) => {
                setProducts(res)
                const totals = items.map(item => {
                    const product = res.find(el => el.id === item.product_id)
                    const price = product?.sale ? product.sale_type === "percents" ? product.basic_price * (100 - product.sale)/100 : product.basic_price - product.sale : product?.basic_price;
                    return (item.quantity ?? 0) * (price ?? 0)
                })
                setCount(items.reduce((a, b)=>{
                    return a + (b.quantity ?? 0)
                }, 0))
                setTotal(totals.reduce((a, b)=>{
                    return a + b;
                }))
            })
        }
    }, [items]);
    return {
        total,
        count,
        products
    }
}
