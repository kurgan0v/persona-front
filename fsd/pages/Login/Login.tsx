"use client";
import s from './Login.module.scss';
import Image from "next/image";
import Logo from '@/fsd/shared/ui/Logo/Logo';
import LoginWidget from "@/fsd/widgets/LoginWidget/LoginWidget";


export default function Login() {
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
