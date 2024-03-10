"use client";
import {App, Button, Form, Input} from "antd";
import {useMutation, useQuery} from "react-query";
import {MainSeoFetcher, MainSeoUpdateFetcher} from "@/fsd/shared/api/info";
import {useEffect} from "react";

export default function MainSeoForm(){
    const {message} = App.useApp();
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
            onFinish={async (e)=>{
                await updateMainSeo(e)
                message.success('Изменения сохранены')
            }}
        >
            <Form.Item name={'seo_title'} label={'SEO-заголовок'}>
                <Input/>
            </Form.Item>
            <Form.Item name={'seo_description'} label={'SEO-описание'}>
                <Input/>
            </Form.Item>
            <Form.Item name={'seo_keywords'} label={'Ключевые слова'}>
                <Input/>
            </Form.Item>
            <Form.Item name={'seo_personal_title'} label={'SEO-заголовок на странице пошива'}>
                <Input/>
            </Form.Item>
            <Form.Item name={'seo_personal_description'} label={'SEO-описание на странице пошива'}>
                <Input/>
            </Form.Item>
            <Form.Item name={'seo_personal_keywords'} label={'Ключевые слова на странице пошива'}>
                <Input/>
            </Form.Item>
            <Form.Item>
                <Button type={'primary'} htmlType={'submit'}>Сохранить</Button>
            </Form.Item>
        </Form>
    )
}
