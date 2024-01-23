import s from "./Session.module.scss";
import {ISession} from "@/fsd/entities/session/model";
import dayjs from "dayjs";
import Delete from "@/fsd/features/Delete/Delete";

interface SessionProps{
    session: ISession
    deleteSession: (id: string) => void
}
export default function Session({session, deleteSession}: SessionProps){
    return(
        <div className={s.session}>
            <p>{session.device}</p>
            <p>{session.browser}</p>
            <p>{dayjs(session.createdAt).format('DD.MM.YYYY HH:MM')}</p>
            <Delete description={"Вы уверены, что хотите удалить сессию?"} onConfirm={() => deleteSession(session.id)}/>
        </div>
    )
}
