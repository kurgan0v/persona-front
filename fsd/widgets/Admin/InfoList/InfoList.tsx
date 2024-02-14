"use client";
import s from './InfoList.module.scss';
import {useMutation, useQuery} from "react-query";
import {InfoAllFetcher, InfoUpdateFetcher} from "@/fsd/shared/api/info";
import InfoBlock from "@/fsd/entities/info/components/InfoBlock/InfoBlock";
import {useState} from "react";
import {App, Button, Form, Input, Modal, Switch} from "antd";
import UploadImage from "@/fsd/shared/ui/UploadImage/UploadImage";
import {UploadFile} from "antd/es/upload/interface";
import {IInfo} from "@/fsd/entities/info/model";
import {InfoUpdateFetcherRequest} from "@/fsd/shared/api/info/types";
export default function InfoList(){
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [image, setImage] = useState<UploadFile[]>([])
    const {data, isSuccess, refetch} = useQuery(['info_all'], InfoAllFetcher)
    const {mutateAsync: updateInfo} = useMutation(InfoUpdateFetcher);
    const [editingInfo, setEditingInfo] = useState('');
    const chooseInfo = (info: IInfo) => {
        setEditingInfo(info.id)
        form.setFieldsValue(info)
        setImage(info.cover ? [{
            uid: '-1',
            name: info.cover,
            status: 'done',
            url: `${process.env.APP_BASE_URL}/files/${info.cover}`,
            response: info.cover
        }] : [])
    }
    const changeImage = (fileName: string, fileList: UploadFile[]) => {
        if (editingInfo) {
            const data = {
                id: editingInfo,
                cover: fileName
            }
            updateInfo(data).then(res => {
                message.success('Обложка блока обновлена').then()
                refetch().then();
            })
        }
    }
    const onFinish = async (values: InfoUpdateFetcherRequest) => {
        await updateInfo(values);
        setEditingInfo('');
        await refetch();
    }
    return(
        <div className={s.wrapper}>
            {isSuccess && data?.map((info) => (
                <InfoBlock key={info.id} info={info} onEditClick={()=>chooseInfo(info)}/>
            ))}
            <Modal
                open={!!editingInfo}
                onCancel={()=> setEditingInfo('')}
                footer={null}
            >
                <Form
                    layout={'vertical'}
                    form={form}
                    onFinish={onFinish}
                >
                    <Form.Item name={'id'} hidden><Input/></Form.Item>
                    <Form.Item label={'Обложка блока'}>
                        <UploadImage list={image} changeImage={changeImage} setFileList={setImage}/>
                    </Form.Item>
                    <Form.Item name={'visible'} label={'Отображать на сайте'} valuePropName={'checked'}>
                        <Switch/>
                    </Form.Item>
                    <Form.Item name={'name'} label={'Название блока'} rules={[
                        {
                            required: true,
                            message: 'Это обязательное поле'
                        }
                    ]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={'text'} label={'Информация'}>
                        <Input.TextArea rows={5}/>
                    </Form.Item>
                    <Form.Item>
                        <Button type={'primary'} htmlType={'submit'}>Сохранить</Button>
                    </Form.Item>
                    <Form.Item></Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
