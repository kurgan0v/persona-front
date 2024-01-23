import s from "./LoginForm.module.scss";
import {Button, Form, FormInstance, Input, Modal} from "antd";
import {LoginFormData} from "./model";
interface LoginFormProps{
    form:  FormInstance
    onFinish: (values: LoginFormData) => void
}
export default function LoginForm({form, onFinish}: LoginFormProps){
    return(
        <Form
            layout="vertical"
            name="login"
            onFinish={onFinish}
            form={form}
            className={s.form}
        >
            <Form.Item
                label="Логин"
                name="login"
                required={false}
                rules={[{required: true, message: 'Это поле обязательно для заполнения'}]}
            >
                <Input placeholder={"Ваш логин"}/>
            </Form.Item>

            <Form.Item
                label="Пароль"
                name="password"
                required={false}
                rules={[{required: true, message: 'Это поле обязательно для заполнения'}]}
            >
                <div>
                    <Input.Password placeholder={"********"}/>
                    {/*<p className={s.forgot}>Забыли пароль?</p>*/}
                </div>
            </Form.Item>

            <Form.Item>
                <Button type={'primary'} htmlType="submit" className={s.btnForm}>Войти</Button>
            </Form.Item>
        </Form>
    )
}
