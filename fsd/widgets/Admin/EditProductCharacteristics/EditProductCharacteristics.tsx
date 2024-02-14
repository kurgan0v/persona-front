import s from "./EditProductCharacteristics.module.scss";
import AddIcon from "@/fsd/shared/ui/icons/AddIcon/AddIcon";
import {App, Button, Col, Form, Input, Modal, Row, Select, Switch, Tooltip} from "antd";
import {CaretDownFilled, QuestionCircleOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import {useMutation} from "react-query";
import {
    CharacteristicCreateOrUpdateFetcher, CharacteristicsByCategoryFetcher, CharacteristicsProductUpdateFetcher,
    CharacteristicsTypeCreateOrUpdateFetcher
} from "@/fsd/shared/api/characteristics";
import {ICharacteristicType} from "@/fsd/entities/characteristics/model";
import {IProductDetail} from "@/fsd/entities/product/model";

interface EditProductCharacteristicsProps {
    characteristics?: ICharacteristicType[],
    product?: IProductDetail
    setCharacteristics: React.Dispatch<React.SetStateAction<ICharacteristicType[] | undefined>>
    refetch: any
}

export default function EditProductCharacteristics({characteristics, product, setCharacteristics, refetch}:EditProductCharacteristicsProps) {
    const {message} = App.useApp();
    const {mutateAsync: getCharacteristicsTypes} = useMutation(CharacteristicsByCategoryFetcher);
    const {mutateAsync: createCharacteristicType} = useMutation(CharacteristicsTypeCreateOrUpdateFetcher);
    const {mutateAsync: createCharacteristic} = useMutation(CharacteristicCreateOrUpdateFetcher);
    const {mutateAsync: updateProductCharacteristic} = useMutation(CharacteristicsProductUpdateFetcher);
    const [characteristicTypeForm] = Form.useForm();
    const [characteristicForm] = Form.useForm();
    const [openModalCharacteristicType, setOpenModalCharacteristicType] = useState(false)
    const [openModalCharacteristic, setOpenModalCharacteristic] = useState(false)
    return (
        <>
            <div className={s.block}>
                <div className={s.blockHeader}>
                    <h3 className={s.subtitle}>Характеристики</h3>
                    <AddIcon onClick={() => {
                        setOpenModalCharacteristicType(true)
                        characteristicTypeForm.setFieldValue('category', product?.category_id)
                    }}/>
                    <Tooltip
                        overlayInnerStyle={{width: '30rem'}}
                        title="Характеристика — параметр товара, который нельзя выбрать при покупке, он не влияет на его цену и отображается в подробной карточке товара. Например, состав ткани или тип застежки. Характеристика привязана к категории и позволяет фильтровать товары. Включить или выключить фильтрацию по конкретной характеристике можно во вкладке категории.">
                        <QuestionCircleOutlined/>
                    </Tooltip>
                </div>
                <Row gutter={30}>
                    {(characteristics && !!characteristics.length) && characteristics.map(el => (
                        <Col key={el.id} span={8}>
                            <Form.Item label={el.name} name={['characteristic', el.id]}>
                                <Select className={s.select} suffixIcon={<CaretDownFilled/>} allowClear
                                        placeholder={'Не выбрано'} onChange={(e) => {
                                    if (product?.id) {
                                        updateProductCharacteristic({
                                            productId: product?.id,
                                            characteristic: product?.characteristics.find(ch => ch.type === el.id)?.id ?? '',
                                            newValue: e
                                        }).then((r) => {
                                            message.success('Характеристики товара обновлены')
                                            refetch();
                                        })
                                    }
                                }}>
                                    {el.characteristics?.map(c => (
                                        <Select.Option value={c.id} key={c.id}>{c.name}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <p className={s.addValue} onClick={() => {
                                setOpenModalCharacteristic(true)
                                characteristicForm.setFieldValue('type', el.id)
                            }}>Добавить значение</p>
                        </Col>
                    ))}
                </Row>
            </div>
            <Modal
                open={openModalCharacteristicType}
                onCancel={() => setOpenModalCharacteristicType(false)}
                title={'Добавить характеристику'}
                footer={null}
            >
                <Form
                    layout={'vertical'}
                    form={characteristicTypeForm}
                    onFinish={(e) => {
                        createCharacteristicType(e).then(r => {
                            if (product?.category_id) {
                                getCharacteristicsTypes(product?.category_id).then(setCharacteristics)
                                message.success('Характеристика создана')
                                setOpenModalCharacteristicType(false)
                            }
                        })
                    }}
                >
                    <Form.Item name={'category'} hidden={true}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={'name'} label={'Отображаемое название'} rules={[
                        {
                            required: true,
                            message: 'Это обязательное поле'
                        }
                    ]}>
                        <Input placeholder={'Материал'}/>
                    </Form.Item>
                    <Form.Item name={'is_filtered'} label={'Использовать характеристику в фильтрах'}
                               valuePropName={'checked'}>
                        <Switch/>
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType={'submit'} type={'primary'}>Добавить</Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                open={openModalCharacteristic}
                onCancel={() => setOpenModalCharacteristic(false)}
                title={'Добавить значение'}
                footer={null}
            >
                <Form
                    layout={'vertical'}
                    form={characteristicForm}
                    onFinish={(e) => {
                        createCharacteristic(e).then(r => {
                            if (product?.category_id) {
                                getCharacteristicsTypes(product?.category_id).then(setCharacteristics)
                                message.success('Значение характеристики создано')
                                setOpenModalCharacteristic(false)
                            }
                        })
                    }}
                >
                    <Form.Item name={'type'} hidden={true}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={'name'} label={'Отображаемое название'} rules={[
                        {
                            required: true,
                            message: 'Это обязательное поле'
                        }
                    ]}>
                        <Input placeholder={'хлопок'}/>
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType={'submit'} type={'primary'}>Добавить</Button>
                    </Form.Item>
                </Form>
            </Modal></>
    )
}
