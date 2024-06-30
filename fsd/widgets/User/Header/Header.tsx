'use client';
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google'
import s from './Header.module.scss';
import Link from "next/link";
import {Badge, Dropdown} from "antd";
import ButtonRound from "@/fsd/shared/ui/ButtonRound/ButtonRound";
import {usePathname, useRouter} from "next/navigation";
import {useQuery} from "react-query";
import {SectionsFetcher} from "@/fsd/shared/api/section";
import {clsx} from "clsx";
import Image from 'next/image';
import Favorite from "@/fsd/shared/ui/icons/Favorite/Favorite";
import CartIcon from "@/fsd/shared/ui/icons/CartIcon/CartIcon";
import {useFavoritesStore} from "@/fsd/app/store/favorites";
import {useStore} from "@/fsd/app/hooks/useStore";
import {useCartStore} from "@/fsd/app/store/cart";
import Burger from "@/fsd/shared/ui/icons/Burger/Burger";
import {Suspense, useEffect, useState} from "react";
import {Metrika} from "@/fsd/widgets/User/Metrika/Metrika";

const routes = [
    {
        name: 'Пошив одежды',
        link: '/personal'
    },
    {
        name: 'Пошив костюмов',
        link: '/personal/suits'
    },
]
const Header = () => {
    const {data: sections, isSuccess, isError} = useQuery(['sections'], SectionsFetcher);
    const pathname = usePathname();
    const activeRoute = pathname.split('/')[1] ?? '';
    const favorites = useStore(useFavoritesStore, (state) => state.favorites);
    const items = useStore(useCartStore, (state) => state.items);
    const [openMenu, setOpenMenu] = useState(false)
    useEffect(() => {
        setOpenMenu(false)
    }, [pathname]);
    return (
        <>
            {process.env.NODE_ENV === 'production' && <Suspense>
                <Metrika/>
                <GoogleAnalytics gaId={'G-XYY9FZT2PE'}/>
                <GoogleTagManager gtmId={'GTM-NB7G97XZ'}/>
                <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NB7G97XZ"
                                  height="0" width="0" style={{ display: "none", visibility: "hidden" }}></iframe></noscript>
            </Suspense>}
            <div className={clsx(s.logo, s.logoMobile)}>
                <Image src={'/logo.png'} alt={'Ателье Персона'} fill/>
            </div>
            <div className={clsx(s.menuWrapper, openMenu && s.opened)} onClick={(e) => {
                setOpenMenu(false)
            }}>
                <div className={s.wrapper} onClick={(e) => e.stopPropagation()}>
                    <Link href={'/'}>
                        <div className={s.logo}>
                            <Image src={'/logo.png'} alt={'Ателье Персона'} fill/>
                        </div>
                    </Link>
                    {isSuccess && <>
                        <div className={s.mainLinks}>
                            <Link
                                className={clsx(s.mainLink, s.mainLinkMobile)}
                                href={`/`}>На главную</Link>
                            {sections.filter(s => s.is_main).map(l => (
                                l.sections.length ? <Dropdown
                                    className={clsx(s.mainLink, (activeRoute === 'boys' || activeRoute === 'girls') && s.activeLink)}
                                    key={l.id} menu={{
                                    items: l.sections.map(sub => ({
                                        key: sub.id,
                                        label: <Link
                                            className={clsx(s.mainLink, activeRoute === sub.link && s.activeLink)}
                                            href={`/${sub.link}`}>{sub.name}</Link>
                                    }))
                                }} placement="bottomLeft">
                                    <p>{l.name}</p>
                                </Dropdown> : <Link href={`/${l.link}`} key={l.id}
                                                    className={clsx(s.mainLink, activeRoute === l.link && s.activeLink)}>{l.name}</Link>
                            ))}
                        </div>
                        <div className={s.otherLinks}>
                            <Dropdown
                                className={clsx(s.otherLink, activeRoute === 'personal' && s.activeLink)}
                                menu={{
                                items: routes.map(r => ({
                                    key: r.link,
                                    label: <Link
                                        className={clsx(s.mainLink, pathname === r.link && s.activeLink)}
                                        href={`${r.link}`}>{r.name}</Link>
                                }))
                            }} placement="bottomLeft">
                                <p>Индивидуальный<br/> пошив</p>
                            </Dropdown>
                            <Link
                                className={clsx(s.otherLink, activeRoute === 'uniform' && s.activeLink)}
                                href={`/uniform`}>Форменное и военное<br/> обмундирование</Link>
                        </div>
                    </>}
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
            </div>
            <div className={s.burger}>
                <ButtonRound className={s.burgerIcon} onClick={() => {
                    setOpenMenu(!openMenu)
                }}>
                    <Burger/>
                </ButtonRound>
            </div>
        </>
    );
};

export default Header;
