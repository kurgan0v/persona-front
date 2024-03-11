"use client";
import s from './CategorySizes.module.scss';
import {Button, Form, Input, Modal, Popconfirm} from "antd";
import {useEffect, useState} from "react";
import {useMutation} from "react-query";
import {
    SizeDeleteFetcher,
    SizesByCategoryFetcher,
    SizesCreateOrUpdateFetcher,
    UpdateSizesOrderFetcher
} from "@/fsd/shared/api/size";
import {ISize} from "@/fsd/entities/size/model";
import AddIcon from "@/fsd/shared/ui/icons/AddIcon/AddIcon";
import {DragDropContext, Draggable, Droppable} from '@hello-pangea/dnd';
import EditIcon from "@/fsd/shared/ui/icons/EditIcon/EditIcon";
import {QuestionCircleOutlined} from "@ant-design/icons";

export default function CategorySizes({categoryId}:{categoryId: string}){
    const [sizeForm] = Form.useForm();
    const [modalOpen, setModalOpen] = useState(false);
    const [editingSize, setEditingSize] = useState('');
    const [sizes, setSizes] = useState<ISize[]>([])
    const {mutateAsync: getSizes, isSuccess} = useMutation(SizesByCategoryFetcher)
    const {mutateAsync: createOrUpdateSize} = useMutation(SizesCreateOrUpdateFetcher);
    const {mutateAsync: deleteSize} = useMutation(SizeDeleteFetcher);
    const {mutateAsync: updateOrder} = useMutation(UpdateSizesOrderFetcher);
    useEffect(() => {
        if(categoryId){
            getSizes(categoryId).then(setSizes)
        }
    }, [categoryId]);
    return(
        <div>
            {isSuccess && <Form.Item>
                <div className={s.header}>
                    <h3>Размеры</h3>
                    <AddIcon onClick={()=>{
                        sizeForm.resetFields();
                        sizeForm.setFieldValue('category', categoryId)
                        setModalOpen(true)
                        setEditingSize('')
                    }}/>
                </div>
                <DragDropContext onDragEnd={(result) => {
                    if (!result.destination) return;
                    const items = Array.from(sizes);
                    const [reorderedItem] = items.splice(result.source.index, 1);
                    items.splice(result.destination.index, 0, reorderedItem);
                    updateOrder(items.map((el, i) => {
                        el.order = i
                        return el;
                    })).then((r)=>{
                        getSizes(categoryId).then(setSizes)
                    })
                }}>
                    <Droppable droppableId={'sizes'}>
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps} className={s.sizes}>
                                {
                                    sizes.map((size, i) => (
                                        <Draggable draggableId={size.id} index={i} key={size.id}>
                                            {(provided) => (
                                                <div
                                                    className={s.size}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    ref={provided.innerRef}
                                                >
                                                    <div>{size.name}</div>
                                                    <EditIcon onClick={()=>{
                                                        sizeForm.setFieldsValue(size);
                                                        setModalOpen(true)
                                                        setEditingSize(size.id);
                                                    }}/>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))
                                }
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </Form.Item>}
            <Modal
                open={modalOpen}
                onCancel={()=>setModalOpen(false)}
                footer={null}
                title={`${editingSize ? 'Редактировать' : 'Добавить'} размер`}
            >
                <Form
                    layout={'vertical'}
                    form={sizeForm}
                    onFinish={(e)=>{
                        createOrUpdateSize(e).then((r) => {
                            getSizes(categoryId).then(setSizes)
                            setModalOpen(false)
                        })
                    }}
                >
                    <Form.Item name={'id'} hidden>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={'category'} hidden>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={'name'} label={'Отображаемое название'} rules={[
                        {
                            required: true,
                            message: 'Это обязательное поле'
                        }
                    ]}>
                        <Input placeholder={'S'}/>
                    </Form.Item>
                    <Form.Item name={'value'} label={'Значение в размерной сетке'}>
                        <Input placeholder={'Обхват груди: 90см'}/>
                    </Form.Item>
                    <Form.Item>
                        <div className={s.btns}>
                            <Button type={'primary'} htmlType={'submit'}>{editingSize ? 'Сохранить' : 'Добавить'}</Button>
                            {editingSize &&
                                <Popconfirm
                                    title={'Размер будет удален у всех товаров в категории. Продолжить?'}
                                    onConfirm={()=>{
                                        deleteSize(editingSize).then(res => {
                                            getSizes(categoryId).then(setSizes)
                                            setModalOpen(false)
                                        })
                                    }}
                                    okText="Да"
                                    cancelText="Отмена"
                                    icon={<QuestionCircleOutlined style={{color: 'red'}}/>}
                                ><Button>Удалить</Button></Popconfirm>}
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
