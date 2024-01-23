import s from './Favorites.module.scss';
import FavoritesList from "@/fsd/widgets/User/FavoritesList/FavoritesList";
export default function Favorites(){

    return(
        <div className={s.wrapper}>
            <h2>Избранное</h2>
            <FavoritesList/>
        </div>
    )
}
