import s from './NotFound.module.scss';
import {Button} from "antd";
import Link from "next/link";
export default function NotFound(){
    return(
        <div className={s.wrapper}>
            <h1>404</h1>
            <p>Страница не найдена</p>
            <Link href={'/'}><Button type={'primary'}>На главную</Button></Link>
        </div>
    )
}
