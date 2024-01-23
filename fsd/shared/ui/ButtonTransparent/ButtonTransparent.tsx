import s from './ButtonTransparent.module.scss';
import {Button} from "antd";

interface ButtonProps{
    children: React.ReactNode
    onClick?: ()=>void
}
const ButtonTransparent:React.FC<ButtonProps> = ({children, onClick}) => {
    return (
        <Button className={s.btn} onClick={onClick}>{children}</Button>
    );
};

export default ButtonTransparent;
