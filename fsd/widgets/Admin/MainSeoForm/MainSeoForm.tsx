"use client";
import {Button, Form, Input} from "antd";
import {useMutation, useQuery} from "react-query";
import {MainSeoFetcher, MainSeoUpdateFetcher} from "@/fsd/shared/api/info";
import {useEffect} from "react";

export default function MainSeoForm(){
    const [form] = Form.useForm();
    const {data, isSuccess} = useQuery(['main_seo'], MainSeoFetcher);
    const {mutateAsync: updateMainSeo} = useMutation(MainSeoUpdateFetcher)
    useEffect(() => {
        if(isSuccess){
            form.setFieldsValue(data)
        }
    }, [isSuccess]);
    return(
        <Form
            form={form}
            layout={'vertical'}
            onFinish={updateMainSeo}
        >
            <Form.Item name={'title'} label={'SEO-заголовок'}>
                <Input/>
            </Form.Item>
            <Form.Item name={'description'} label={'SEO-описание'}>
                <Input/>
            </Form.Item>
            <Form.Item name={'keywords'} label={'Ключевые слова'}>
                <Input/>
            </Form.Item>
            <Form.Item>
                <Button type={'primary'} htmlType={'submit'}>Сохранить</Button>
            </Form.Item>
        </Form>
    )
}
