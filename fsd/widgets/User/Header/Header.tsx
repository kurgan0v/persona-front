'use client';
import s from './Header.module.scss';
import Link from "next/link";
import {Badge, Dropdown} from "antd";
import ButtonRound from "@/fsd/shared/ui/ButtonRound/ButtonRound";
import {usePathname} from "next/navigation";
import {useQuery} from "react-query";
import {SectionsFetcher} from "@/fsd/shared/api/section";
import {clsx} from "clsx";
import Image from 'next/image';
import Favorite from "@/fsd/shared/ui/icons/Favorite/Favorite";
import CartIcon from "@/fsd/shared/ui/icons/CartIcon/CartIcon";
import {useFavoritesStore} from "@/fsd/app/store/favorites";
import {useStore} from "@/fsd/app/hooks/useStore";
import {useCartStore} from "@/fsd/app/store/cart";

const Header = () => {
    const {data: sections, isSuccess, isError} = useQuery(['sections'], SectionsFetcher);
    const pathname = usePathname();
    const activeRoute = pathname.split('/')[1] ?? '';
    const favorites = useStore(useFavoritesStore,(state)=>state.favorites);
    const items = useStore(useCartStore,(state)=>state.items);
    return (
        <div className={s.wrapper}>
            <Link href={'/'}>
                <div className={s.logo}>
                    <Image src={'/logo.png'} alt={'Ателье Персона'} fill/>
                </div>
            </Link>
            {isSuccess && <>
                <div className={s.mainLinks}>
                    {sections.filter(s => s.is_main).map(l => (
                        l.sections.length ? <Dropdown className={clsx(s.mainLink, (activeRoute === 'boys' || activeRoute === 'girls') && s.activeLink)} key={l.id} menu={{ items: l.sections.map(sub => {
                                return {
                                    key: sub.id,
                                    label: <Link className={clsx(s.mainLink, activeRoute === sub.link && s.activeLink)} href={`/${sub.link}`}>{sub.name}</Link>
                                }
                            }) }} placement="bottomLeft">
                            <p>{l.name}</p>
                        </Dropdown> : <Link href={`/${l.link}`} key={l.id} className={clsx(s.mainLink, activeRoute === l.link && s.activeLink)}>{l.name}</Link>
                    ))}
                </div>
                <div className={s.otherLinks}>
                    <Link className={s.otherLink} href={`/personal`} >Индивидуальный<br/> пошив</Link>
                    {sections.filter(s => !s.is_main).map(el => (
                        <Link key={el.id} className={clsx(s.otherLink, activeRoute === 'uniform' && s.activeLink)} href={`/uniform`} >Форменное и военное<br/> обмундирование</Link>
                    ))}
                </div></>}
            <div className={s.actions}>
                <Link href={'/cart'}>
                    <Badge count={items?.length}>
                        <ButtonRound>
                            <CartIcon/>
                        </ButtonRound>
                    </Badge>
                </Link>
                <Link href={'/favorites'}>
                    <Badge count={favorites?.length}>
                        <ButtonRound>
                            <Favorite/>
                        </ButtonRound>
                    </Badge>
                </Link>
            </div>
        </div>
    );
};

export default Header;
