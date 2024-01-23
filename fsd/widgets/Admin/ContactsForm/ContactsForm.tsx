"use client";
import {Button, Form, Input} from "antd";
import {useMutation, useQuery} from "react-query";
import {ContactsFetcher, ContactsUpdateFetcher} from "@/fsd/shared/api/info";
import {useEffect} from "react";

export default function ContactsForm(){
    const [form] = Form.useForm();
    const {data, isSuccess} = useQuery(['contacts'], ContactsFetcher);
    const {mutateAsync: updateContacts} = useMutation(ContactsUpdateFetcher)
    useEffect(() => {
        if(isSuccess){
            form.setFieldsValue(data)
        }
    }, [isSuccess]);
    return(
        <Form
            form={form}
            layout={'vertical'}
            onFinish={updateContacts}
        >
            <Form.Item name={'phone'} label={'Телефон'}>
                <Input/>
            </Form.Item>
            <Form.Item name={'email'} label={'E-mail'}>
                <Input/>
            </Form.Item>
            <Form.Item name={'vk'} label={'Ссылка на Вконтакте'}>
                <Input/>
            </Form.Item>
            <Form.Item name={'instagram'} label={'Ссылка на Instagram'}>
                <Input/>
            </Form.Item>
            <Form.Item>
                <Button type={'primary'} htmlType={'submit'}>Сохранить</Button>
            </Form.Item>
        </Form>
    )
}
