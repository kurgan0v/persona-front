"use client";
import s from './Login.module.scss';
import Image from "next/image";
import Logo from '@/fsd/shared/ui/Logo/Logo';
import LoginWidget from "@/fsd/widgets/LoginWidget/LoginWidget";
import {useEffect} from "react";
import {useRouter} from "next/navigation";


export default function Login() {
    const { push } = useRouter();
    useEffect(() => {
        if(localStorage.getItem('accessToken')){
            push('/admin/sections')
        }
    }, []);
    return (
        <div className={s.wrapper}>
            <Image src={'/login_bg.jpg'} alt={''} fill className={s.bg}/>
            <div className={s.loginForm}>
                <Logo/>
                <h2 className={s.title}>Вход</h2>
                <LoginWidget/>
            </div>
        </div>
    )
}
