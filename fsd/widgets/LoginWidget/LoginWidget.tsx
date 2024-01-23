import {App, Form, Modal} from "antd";
import {useState} from "react";
import {ISession} from "@/fsd/entities/session/model";
import {useRouter} from "next/navigation";
import {useMutation} from "react-query";
import {DeleteSessionFetcher, LoginFetcher} from "@/fsd/shared/api/auth";
import {LoginFormData} from "@/fsd/features/LoginForm/model";
import s from "./LoginWidget.module.scss";
import Session from "@/fsd/entities/session/components/Session/Session";
import LoginForm from "@/fsd/features/LoginForm/LoginForm";

export default function LoginWidget(){
    const { message } = App.useApp();
    const [modal, setModal] = useState(false);
    const [sessions, setSessions] = useState<ISession[]>([]);
    const [temporaryToken, setTemporaryToken] = useState('');
    const {push} = useRouter();
    const [form] = Form.useForm();
    const {mutateAsync: login} = useMutation(LoginFetcher)
    const loginFetcher = (values: LoginFormData)=>{
        login(values).then(r => {
            if (r.code === 0 && r.accessToken) {
                localStorage.setItem('accessToken', r.accessToken);
                push('/admin/promo')
            } else {
                if (r.code === 2 && r.sessions && r.accessToken) {
                    setModal(true)
                    setSessions(r.sessions);
                    setTemporaryToken(r.accessToken)
                } else {
                    message.open({
                        type: 'error',
                        content: r.error,
                    });
                }
            }
        })
    }
    const onFinish = (values: LoginFormData) => {
        loginFetcher(values)
    }
    const {mutateAsync: deleteSession} = useMutation(DeleteSessionFetcher)
    const deleteSessionConfirm = (id: string) => {
        deleteSession({id, temporaryToken}).then(() => {
                loginFetcher(form.getFieldsValue())
            }
        )
    }
    return(
        <>
            <LoginForm form={form} onFinish={onFinish}/>
            <Modal
                title={'Превышено количество активных сессий'}
                open={modal}
                footer={<></>}
                onCancel={() => setModal(false)}
            >
                <p>Для того, чтобы продолжить авторизацию необходимо закрыть одну из активных
                    сессий</p>
                <div className={s.sessions}>
                    {
                        sessions.map((el) => (
                            <Session session={el} deleteSession={deleteSessionConfirm} key={el.id}/>
                        ))
                    }
                </div>
            </Modal>
        </>
    )
}
