"use client";
import s from './OrdersList.module.scss';
import {useMutation, useQuery} from "react-query";
import {useState} from "react";
import {Button, Col, DatePicker, Form, Input, Modal, Pagination, Row, Select} from 'antd';
import Empty from "@/fsd/shared/ui/Empty/Empty";
import {DELIVERY_STATUSES, ONLINE_PAYMENT_STATUSES, ORDER_STATUSES, REQUEST_TYPES} from "@/fsd/app/const";
import locale from 'antd/es/date-picker/locale/ru_RU';
import 'dayjs/locale/ru';
import {Dayjs} from "dayjs";
import {OrdersFetcher, OrderUpdateFetcher} from "@/fsd/shared/api/order";
import OrderItem from "@/fsd/entities/order/components/OrderItem/OrderItem";
export default function OrdersList() {
    const [form] = Form.useForm();
    const [page, setPage] = useState(1);
    const [editModal, setEditModal] = useState(false);
    const [dateStart, setDateStart] = useState<Dayjs | null>(null);
    const [dateEnd, setDateEnd] = useState<Dayjs | null>(null);
    const [status, setStatus] = useState<string[]>([]);
    const {data: orders, isSuccess, refetch} = useQuery(['requests', page, dateStart, dateEnd, status], () => {
        return OrdersFetcher({
            page,
            dateStart: dateStart?.format('YYYY-MM-DD'),
            dateEnd: dateEnd?.format('YYYY-MM-DD'),
            status
        })
    });
    const {mutateAsync: updateOrder} = useMutation(OrderUpdateFetcher);
    return (
        <div>
            {isSuccess && <>

                <Form layout={'vertical'}>
                    <Row gutter={30}>
                        <Col span={8}>
                            <Form.Item label={'Начало периода'}>
                                <DatePicker value={dateStart} locale={locale} onChange={(e, s)=> {setDateStart(e)}}/>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label={'Конец периода'}>
                                <DatePicker value={dateEnd} locale={locale}  onChange={(e, s)=> {setDateEnd(e)}}/>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label={'Статус заказа'}>
                                <Select value={status} onChange={setStatus} placeholder={'Все'} mode={'multiple'} showSearch={false} className={s.select}>
                                    {ORDER_STATUSES.map((el, i) => <Select.Option key={i}
                                                                                 value={i}>{el}</Select.Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <div className={s.list}>
                    {orders?.orders?.length ? orders?.orders.map((el) =>
                            <OrderItem
                                order={el}
                                key={el.id}
                                setEditModal={()=>{
                                    setEditModal(true)
                                    form.setFieldsValue(el)
                                }}
                            />) :
                        <Empty title={'Заказы не найдены'}/>}
                </div>
                <Pagination pageSize={20} current={page} hideOnSinglePage onChange={setPage} total={orders?.total}/>
            </>}
            <Modal
                open={editModal}
                onCancel={()=>setEditModal(false)}
                title={'Редактирование заказа'}
                footer={null}
            >
                <Form
                    form={form}
                    onFinish={async (e)=>{
                        updateOrder(e).then((r)=>{
                            setEditModal(false);
                            refetch();
                        })
                    }}
                    layout={'vertical'}
                >
                    <Form.Item name={'id'} hidden><Input/></Form.Item>
                    <Form.Item name={'delivery_status'} label={'Статус доставки'}>
                        <Select className={s.select}>
                            {DELIVERY_STATUSES.map((t, i) => <Select.Option value={i} key={i}>{t}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name={'online_payment_status'} label={'Статус оплаты'}>
                        <Select className={s.select}>
                            {ONLINE_PAYMENT_STATUSES.map((t, i) => <Select.Option value={i} key={i}>{t}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name={'status'} label={'Статус заказа'}>
                        <Select className={s.select}>
                            {ORDER_STATUSES.map((t, i) => <Select.Option value={i} key={i}>{t}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name={'comment'} label={'Информация о заказе'}>
                        <Input.TextArea/>
                    </Form.Item>
                    <Form.Item>
                        <div className={s.orderActions}>
                            <Button type={'primary'} htmlType={'submit'}>Сохранить</Button>
                            {/*<Button onClick={()=>{
                                form.setFieldValue('status', 7)
                                form.setFieldValue('delivery_status', 3)
                                form.setFieldValue('online_payment_status', 4)
                                form.submit()
                            }}>Завершить заказ</Button>*/}
                        </div>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}
