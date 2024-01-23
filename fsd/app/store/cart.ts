import {create} from 'zustand';
import {devtools, persist} from 'zustand/middleware';
import {immer} from 'zustand/middleware/immer';
import {ICartItem} from "@/fsd/entities/cartItem/model";

interface ICartStore {
    order_number?: number
    items: ICartItem[]
    addItem: (item: ICartItem) => void
    increaseValue: (item: ICartItem) => void
    decreaseValue: (item: ICartItem) => void
    setValue: (item: ICartItem, value: number) => void
    deleteItem: (item: ICartItem) => void
    setOrderNumber: (order_number: number) => void
    clearCart: () => void
}

export const useCartStore = create<ICartStore>()(
    persist(
        devtools(
            immer((setState) => ({
                items: [],
                addItem: (item) => {
                    setState((store) => {
                        if (store.items.find(el => el.product_id === item.product_id && el.size_id === item.size_id)) {
                            const i = store.items.findIndex(el => el.product_id === item.product_id && el.size_id === item.size_id);
                            store.items[i].quantity = (store.items[i].quantity ?? 0) + 1;
                        } else {
                            store.items.push(item)
                        }
                    })
                },
                increaseValue: (item) => {
                    setState((store)=>{
                        const i = store.items.findIndex(el => el.product_id === item.product_id  && el.size_id === item.size_id);
                        store.items[i].quantity = (store.items[i].quantity ?? 0) + 1;
                    })
                },
                decreaseValue: (item) => {
                    setState((store)=>{
                        const i = store.items.findIndex(el => el.product_id === item.product_id && el.size_id === item.size_id);
                        const newValue = (store.items[i].quantity ?? 0) - 1;
                        if(newValue > 0){
                            store.items[i].quantity = newValue;
                        } else {
                            store.items = store.items.filter(i => i.product_id !== item.product_id || i.size_id !== item.size_id)
                        }

                    })
                },
                setValue: (item, value) => {
                    setState((store)=>{
                        const i = store.items.findIndex(el => el.product_id === item.product_id && el.size_id === item.size_id);
                        store.items[i].quantity = value;
                    })
                },
                deleteItem: (item) => {
                    setState((store)=>{
                        store.items = store.items.filter(i => i.product_id !== item.product_id || i.size_id !== item.size_id)
                    })
                },
                setOrderNumber: (order_number) => {
                    setState((store) => {
                        store.order_number = order_number
                    })
                },
                clearCart: () => {
                    setState((store)=>{
                        store.items = []
                    })
                }
            }))
        ),
        {name: 'cart', version: 1}
    )
);

