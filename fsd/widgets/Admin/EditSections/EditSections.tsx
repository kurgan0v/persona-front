"use client";
import s from "./EditSections.module.scss";
import SectionAdmin from "@/fsd/entities/section/components/SectionAdmin/SectionAdmin";
import {App, Button, Form, Input, Modal} from "antd";
import UploadImage from "@/fsd/shared/ui/UploadImage/UploadImage";
import {useState} from "react";
import {UploadFile} from "antd/es/upload/interface";
import {useMutation, useQuery} from "react-query";
import {SectionsAllFetcher, SectionUpdateFetcher} from "@/fsd/shared/api/section";
import {ISection} from "@/fsd/entities/section/model";

export default function EditSections(){
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [image, setImage] = useState<UploadFile[]>([])
    const [editingSection, setEditingSection] = useState<string | undefined>();
    const {
        data: sections,
        isSuccess,
        isError,
        refetch: refetchSections
    } = useQuery(['sections_all'], SectionsAllFetcher);
    const choseSection = (section: ISection) => {
        setEditingSection(section.id)
        form.setFieldsValue(section)
        setImage(section.cover ? [{
            uid: '-1',
            name: section.cover,
            status: 'done',
            url: `${process.env.APP_BASE_URL}/files/${section.cover}`,
            response: section.cover
        }] : [])
    }
    const {mutateAsync: updateSection} = useMutation(SectionUpdateFetcher);
    const changeImage = (fileName: string, fileList: UploadFile[]) => {
        if (editingSection) {
            const data = {
                id: editingSection,
                cover: fileName
            }
            updateSection(data).then(res => {
                message.success('Обложка раздела обновлена').then()
                refetchSections().then();
            })
        }
    }

    const onFinishForm = async (values: { id: string, name?: string }) => {
        await updateSection(values);
        setEditingSection(undefined);
        refetchSections().then();
    }
    return(
        <div className={s.wrapper}>
            <h2>Разделы</h2>
            <div className={s.sections}>
                {isSuccess && sections.map(el => (
                    <SectionAdmin section={el} onEditClick={() => choseSection(el)} key={el.id}/>
                ))}
            </div>
            <Modal
                open={!!editingSection}
                onCancel={() => setEditingSection(undefined)}
                footer={null}
                title={'Редактирование раздела'}
            >
                <Form
                    form={form}
                    layout={'vertical'}
                    onFinish={onFinishForm}
                >
                    <Form.Item name={'id'} hidden><Input/></Form.Item>
                    <Form.Item label={'Обложка раздела'}>
                        <UploadImage list={image} changeImage={changeImage} setFileList={setImage}/>
                    </Form.Item>
                    <Form.Item name={'name'} label={'Отображаемое название'}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={'seo_title'} label={'SEO заголовок'}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={'seo_description'} label={'SEO описание'}>
                        <Input.TextArea/>
                    </Form.Item>
                    <Form.Item name={'seo_keywords'} label={'Ключевые слова'}>
                        <Input.TextArea/>
                    </Form.Item>
                    <Form.Item>
                        <Button type={'primary'} htmlType={'submit'}>Сохранить</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
