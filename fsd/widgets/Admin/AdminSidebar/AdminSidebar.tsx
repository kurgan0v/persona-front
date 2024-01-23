"use client";
import s from './AdminSidebar.module.scss';
import Logo from "@/fsd/shared/ui/Logo/Logo";
import Link from "next/link";
import {Button} from "antd";
import React, {useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import {useMutation} from "react-query";
import {LogoutFetcher} from "@/fsd/shared/api/auth";
import {sidebarLinks} from "./const";
import {clsx} from "clsx";
import Logout from "@/fsd/shared/ui/icons/Logout/Logout";
export default function AdminSidebar(){
    const [show, setShow] = useState(true);
    const { push } = useRouter();
    const path = usePathname()?.split('/')[2];
    const {mutateAsync: logout} = useMutation(LogoutFetcher);
    const clickLogout = () => {
        logout().then(r => {
            localStorage.removeItem('accessToken');
            push('/login')
        })
    }
    return(
        <div className={s.sidebar}>
            <div className={s.mainInfo}>
                <Logo/>
                <div className={s.links}>
                    {sidebarLinks.map((l)=>(
                        <Link key={l.link} href={`/admin/${l.link}`} className={clsx(s.sidebarLink, path === l.link && s.active)}>{l.name}</Link>
                    ))}
                </div>
            </div>
            <Button className={s.exit} onClick={clickLogout}>
                <Logout/>
                Выход
            </Button>
        </div>
    )
}
