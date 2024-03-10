"use client";
import s from './AdminSidebar.module.scss';
import Logo from "@/fsd/shared/ui/Logo/Logo";
import Link from "next/link";
import {Button} from "antd";
import React, {useState} from "react";
import {usePathname, useRouter, useSelectedLayoutSegments} from "next/navigation";
import {useMutation} from "react-query";
import {LogoutFetcher} from "@/fsd/shared/api/auth";
import {sidebarLinks} from "./const";
import {clsx} from "clsx";
import Logout from "@/fsd/shared/ui/icons/Logout/Logout";
export default function AdminSidebar(){
    const [hideSidebar, setHideSidebar] = useState(true)
    const segments = useSelectedLayoutSegments()
    const { push } = useRouter();
    const {mutateAsync: logout} = useMutation(LogoutFetcher);
    const clickLogout = () => {
        logout().then(r => {
            localStorage.removeItem('accessToken');
            push('/login')
        })
    }
    return(
        <div className={clsx(s.wrapper, hideSidebar && s.wrapperHidden)} onClick={()=>setHideSidebar(true)}>
            <div className={clsx(s.sidebar, hideSidebar && s.hidden)} onClick={(e)=>e.stopPropagation()}>
                <div className={s.mainInfo}>
                    <Logo/>
                    <div className={s.links}>
                        {sidebarLinks.map((l)=>(
                            <Link onClick={()=>setHideSidebar(true)} key={l.link} href={`/admin/${l.link}`} className={clsx(s.sidebarLink, segments[0] === l.link && s.active)}>{l.name}</Link>
                        ))}
                    </div>
                </div>
                <Button className={s.exit} onClick={clickLogout}>
                    <Logout/>
                    Выход
                </Button>
                <div onClick={()=>setHideSidebar(!hideSidebar)} className={s.arrow}>
                    <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M27.2228 16.1343L11.6473 0.559142C11.2871 0.198616 10.8062 0 10.2934 0C9.78068 0 9.29979 0.198616 8.93955 0.559142L7.79253 1.70588C7.04615 2.45311 7.04615 3.66757 7.79253 4.41366L20.8716 17.4927L7.77801 30.5863C7.41777 30.9469 7.21887 31.4275 7.21887 31.9399C7.21887 32.453 7.41777 32.9336 7.77801 33.2944L8.92504 34.4409C9.28556 34.8014 9.76617 35 10.2789 35C10.7917 35 11.2726 34.8014 11.6328 34.4409L27.2228 18.8515C27.5839 18.4898 27.7822 18.0069 27.7811 17.4936C27.7822 16.9783 27.5839 16.4957 27.2228 16.1343Z" fill="currentColor"/>
                    </svg>
                </div>
            </div>
        </div>
    )
}
