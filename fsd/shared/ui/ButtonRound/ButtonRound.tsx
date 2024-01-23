import s from './ButtonRound.module.scss';
import {Button} from "antd";
import {clsx} from "clsx";
interface ButtonProps {
    children: React.ReactNode
    onClick?: ()=>void
    className?: string
}

const ButtonRound: React.FC<ButtonProps> = ({children, onClick, className}) => {
    return (
        <Button className={clsx(s.btn, className)} onClick={onClick}>
            <div className={s.icon}>
                {children}
            </div>
        </Button>
    );
};

export default ButtonRound;
