import {App, Button, Form, Input, Modal, Upload, UploadProps} from "antd";
import React, {useState} from "react";
import s from './RequestWidget.module.scss';
import {QuestionCircleOutlined, UploadOutlined} from "@ant-design/icons";
import {UploadFile} from "antd/es/upload/interface";
import {useMutation} from "react-query";
import {RequestCreateFetcher} from "@/fsd/shared/api/request";
import {MaskedInput} from "antd-mask-input";

export default function RequestWidget(){
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const [modal, setModal] = useState(false);
    const [list , setList] = useState<UploadFile[]>([])
    const {mutateAsync: sendRequest} = useMutation(RequestCreateFetcher);
    const props: UploadProps = {
        fileList: list,
        listType: "picture-card",
        customRequest: async (e)=>{
            if(e.onSuccess){
                e.onSuccess("Ok");
            }
        },
        onChange: ({ fileList }) => {
            setList(fileList);
        }
    };
    return(
        <>
            <Button type={'primary'} onClick={()=>setModal(true)}>Оставить заявку</Button>
            <Modal
                open={modal}
                onCancel={()=>setModal(false)}
                footer={[]}
                width={'30rem'}
                title={'Заявка на пошив'}
            >
                <Form
                    layout={'vertical'}
                    form={form}
                    initialValues={{
                        type: 0
                    }}
                    className={s.form}
                    onFinish={async (e)=>{
                        const data = new FormData();
                        for(let key in e){
                            if(e[key]){
                                data.append(key, e[key]);
                            }
                        }
                        list.forEach((f)=>{
                            if(f.originFileObj){
                                data.append('files', f.originFileObj, f.originFileObj.name);
                            }
                        })
                        sendRequest(data).then(async ()=>{
                            setList([])
                            setModal(false);
                            form.resetFields();
                            await message.success('Ваша заявка принята! Мы свяжемся с вами в ближайшее время для уточнения деталей')
                        }).catch(async ()=>{
                            await message.error('При отправке заявки произошла ошибка. Попробуйте позже или свяжитесь с нами другим способом')
                        })
                    }}
                >
                    <Form.Item name={'name'} label={'Ваше имя'} rules={[{
                        required: true,
                        message: 'Обязательно заполните это поле'
                    }]}>
                        <Input placeholder={'Иван'}/>
                    </Form.Item>
                    <Form.Item name={'type'} hidden>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={'phone'} label={'Ваш телефон'} rules={[{
                        required: true,
                        message: 'Это обязательное поле'
                    }]}>
                        <MaskedInput mask={'+{7}(000)000-00-00'} maskOptions={{lazy: true}}/>
                    </Form.Item>
                    <Form.Item name={'comment'} label={'Подробно опишите предмет одежды'}>
                        <Input.TextArea rows={3} placeholder={'Двубортное пальто'}/>
                    </Form.Item>
                    <Form.Item label={'Добавьте фото, если необходимо'}>
                        <Upload fileList={list} {...props}>
                            {list.length >= 5 ? null : <Button icon={<UploadOutlined/>}></Button>}
                        </Upload>
                    </Form.Item>
                    <Form.Item>
                        <Button type={'primary'} htmlType={'submit'}>Отправить</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}
