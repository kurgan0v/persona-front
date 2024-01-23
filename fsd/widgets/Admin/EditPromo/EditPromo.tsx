"use client";
import s from "./EditPromo.module.scss";
import {App, Button, Col, Form, Input, Modal, Popover, Row, Select, Switch} from "antd";
import UploadImage from "@/fsd/shared/ui/UploadImage/UploadImage";
import {useEffect, useState} from "react";
import {UploadFile} from "antd/es/upload/interface";
import {useMutation, useQuery} from "react-query";
import {SectionsAllFetcher} from "@/fsd/shared/api/section";
import {
    CategoriesDeleteFetcher,
    CategoriesFetcher,
    CategoryCreateFetcher,
    CategoryUpdateFetcher
} from "@/fsd/shared/api/category";
import CategoryAdmin from "@/fsd/entities/category/components/CategoryAdmin/CategoryAdmin";
import Empty from "@/fsd/shared/ui/Empty/Empty";
import AddIcon from "@/fsd/shared/ui/icons/AddIcon/AddIcon";
import {CategoryUpdateCreateFetcherRequest} from "@/fsd/shared/api/category/types";
import {CaretDownFilled} from "@ant-design/icons";
import {ICategory} from '@/fsd/entities/category/model';
import CategoryCharacteristics from "@/fsd/widgets/Admin/CategoryCharacteristics/CategoryCharacteristics";
import CategorySizes from "@/fsd/widgets/Admin/CategorySizes/CategorySizes";
import {
    CreateOrUpdatePromoFetcher,
    DeletePromoFetcher,
    PromosFetcher,
    UpdatePromoOrderFetcher
} from "@/fsd/shared/api/promo";
import PromoBlock from "@/fsd/entities/promo/components/PromoBlock/PromoBlock";
import {IPromo} from "@/fsd/entities/promo/model";
import {CreateOrUpdatePromoFetcherResponse} from "@/fsd/shared/api/promo/types";
import {DragDropContext, Draggable, Droppable} from "@hello-pangea/dnd";
import EditIcon from "@/fsd/shared/ui/icons/EditIcon/EditIcon";

export default function EditPromo() {
    const {message} = App.useApp();
    const [form] = Form.useForm();
    const [promos, setPromos] = useState<IPromo[]>([])
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPromo, setEditingPromo] = useState<string | undefined>();
    const [image, setImage] = useState<UploadFile[]>([])
    const {
        data: dataPromos,
        isSuccess
    } = useQuery(['promos_all'], PromosFetcher);
    const {
        data: sections,
        isSuccess: isSuccessSections
    } = useQuery(['sections_all'], SectionsAllFetcher);
    useEffect(() => {
        if (isSuccess) {
            setPromos(dataPromos)
        }
    }, [isSuccess]);

    const {mutateAsync: createOrUpdatePromo} = useMutation(CreateOrUpdatePromoFetcher);
    const {mutateAsync: deletePromo} = useMutation(DeletePromoFetcher);
    const {mutateAsync: updateOrder} = useMutation(UpdatePromoOrderFetcher);


    const choosePromo = (promo: IPromo) => {
        setEditingPromo(promo.id)
        form.resetFields();
        form.setFieldsValue(promo)
        form.setFieldValue('sections', promo.sections ?? [])
        setImage(promo.cover ? [{
            uid: '-1',
            name: promo.cover,
            status: 'done',
            url: `${process.env.APP_BASE_URL}/files/${promo.cover}`,
            response: promo.cover
        }] : [])
        setModalOpen(true);
    }
    const changeImage = (fileName: string, fileList: UploadFile[]) => {
        if (editingPromo) {
            const data = {
                id: editingPromo,
                cover: fileName
            }
            createOrUpdatePromo(data).then(res => {
                message.success('Обложка промо-акции обновлена').then()
                setPromos(res)
            })
        }
    }
    const deletePromoConfirm = (id: string) => {
        deletePromo(id).then(setPromos)
    }

    const onFinishForm = (values: CreateOrUpdatePromoFetcherResponse) => {
        const data = {...values};
        if (!editingPromo) {
            data.cover = image.length ? image[0]?.response : '';
        }
        setEditingPromo('');
        setModalOpen(false)
        createOrUpdatePromo(data).then(setPromos)
    }

    const addPromoClick = () => {
        form.resetFields();
        setImage([]);
        setEditingPromo('');
        setModalOpen(true);
    }
    const {Option} = Select;
    return (
        <div className={s.wrapper}>
            <div className={s.header}>
                <h2>Промо-акции</h2>
                <AddIcon onClick={addPromoClick}/>
            </div>

            <DragDropContext onDragEnd={(result) => {
                if (!result.destination) return;
                const items = Array.from(promos);
                const [reorderedItem] = items.splice(result.source.index, 1);
                items.splice(result.destination.index, 0, reorderedItem);
                updateOrder(items.map((el, i) => {
                    el.order = i
                    return el;
                })).then(setPromos)
            }}>
                <Droppable droppableId={'sizes'}>
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps} className={s.promos}>

                            {promos ? promos.length ? promos.map((p, i) => (
                                <Draggable draggableId={p.id} index={i} key={p.id}>
                                    {(provided) => (
                                        <div
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            ref={provided.innerRef}
                                        >
                                            <PromoBlock promo={p} key={p.id}
                                                        onDeleteClick={() => deletePromoConfirm(p.id)}
                                                        onEditClick={() => choosePromo(p)}/>
                                        </div>
                                    )}
                                </Draggable>
                            )) : <Empty title={'Вы пока не добавляли промо-акции'}/> : null}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <Modal
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                footer={null}
                title={editingPromo ? 'Редактирование промо-акции' : 'Новая промо-акция'}
            >
                <Form
                    form={form}
                    layout={'vertical'}
                    onFinish={onFinishForm}
                >
                    {editingPromo && <Form.Item name={'id'} hidden><Input/></Form.Item>}
                    <Form.Item label={'Обложка промо-акции'}>
                        <UploadImage list={image} changeImage={changeImage} setFileList={setImage}/>
                    </Form.Item>
                    <Form.Item name={'visible'} label={'Показывать на сайте'} valuePropName={'checked'}>
                        <Switch/>
                    </Form.Item>
                    <Form.Item name={'sections'} label={'Разделы'}>
                        <Select suffixIcon={<CaretDownFilled/>} className={s.select} mode="multiple"
                                placeholder={'Выберите раздел'}>
                            {isSuccessSections && sections.filter(el => el.link).map(el => (
                                <Option key={el.id} value={el.id}>{el.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item name={'title'} label={'Заголовок'}>
                        <Input placeholder={'Скидки на осеннюю коллекцию до -40%'}/>
                    </Form.Item>
                    <Form.Item name={'description'} label={'Описание'}>
                        <Input.TextArea placeholder={'Дополнительная информация'} rows={3}/>
                    </Form.Item>
                    <Form.Item name={'link'} label={'Cсылка'}>
                        <Input placeholder={'fall-winter-2024'}/>
                    </Form.Item>
                    <Form.Item>
                        <Button type={'primary'} htmlType={'submit'}>Сохранить</Button>
                    </Form.Item>
                </Form>
            </Modal>

        </div>
    )
}
