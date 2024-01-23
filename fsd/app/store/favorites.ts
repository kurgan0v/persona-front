import {create} from 'zustand';
import {devtools, persist} from 'zustand/middleware';
import {immer} from 'zustand/middleware/immer';
interface IFavoritesStore {
    favorites: string[]
    setFavorites: (value: string) => void
}
export const useFavoritesStore = create<IFavoritesStore>()(
    persist(
        devtools(
            immer((setState) => ({
                favorites: [],
                setFavorites: (value) =>
                    setState((store) => {
                        if(store.favorites.includes(value)){
                            store.favorites = store.favorites.filter((f: string) => f !== value);
                        } else {
                            store.favorites = [...store.favorites, value];
                        }
                    })
            }))
        ),
        {name: 'favorites', version: 1}
    )
);

