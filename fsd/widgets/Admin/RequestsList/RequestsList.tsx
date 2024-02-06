"use client";
import s from './RequestsList.module.scss';
import {useMutation, useQuery} from "react-query";
import {RequestsFetcher, RequestUpdateFetcher} from "@/fsd/shared/api/request";
import {useState} from "react";
import {Button, Col, DatePicker, Form, Input, Modal, Pagination, Row, Select} from 'antd';
import RequestItem from "@/fsd/entities/request/components/RequestItem/RequestItem";
import Empty from "@/fsd/shared/ui/Empty/Empty";
import {REQUEST_TYPES} from "@/fsd/app/const";
import locale from 'antd/es/date-picker/locale/ru_RU';
import 'dayjs/locale/ru';
import dayjs, {Dayjs} from "dayjs";
export default function RequestsList() {
    const [form] = Form.useForm();
    const [page, setPage] = useState(1);
    const [editModal, setEditModal] = useState(false);
    const [dateStart, setDateStart] = useState<Dayjs | null>(null);
    const [dateEnd, setDateEnd] = useState<Dayjs | null>(null);
    const [status, setStatus] = useState<string[]>([]);
    const {data: requests, isSuccess, refetch} = useQuery(['requests', page, dateStart, dateEnd, status], () => {
        return RequestsFetcher({
            page,
            dateStart: dateStart?.format('YYYY-MM-DD'),
            dateEnd: dateEnd?.format('YYYY-MM-DD'),
            status
        })
    });
    const {mutateAsync: updateRequest} = useMutation(RequestUpdateFetcher);
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
                            <Form.Item label={'Статус заявки'}>
                                <Select value={status} onChange={setStatus} placeholder={'Все'} mode={'multiple'} showSearch={false} className={s.select}>
                                    {REQUEST_TYPES.map((el, i) => <Select.Option key={i}
                                                                                 value={i}>{el}</Select.Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

                <div className={s.list}>
                    {requests?.requests?.length ? requests?.requests.map((el) =>
                            <RequestItem
                                request={el}
                                key={el.id}
                                setEditModal={()=>{
                                    setEditModal(true)
                                    form.setFieldsValue(el)
                                }}
                            />) :
                        <Empty title={'У вас пока нет заявок на пошив'}/>}
                </div>
                <Pagination pageSize={20} current={page} hideOnSinglePage onChange={setPage} total={requests?.total}/>
            </>}
            <Modal
                open={editModal}
                onCancel={()=>setEditModal(false)}
                title={'Редактирование заявки'}
                footer={null}
            >
                <Form
                    form={form}
                    onFinish={async (e)=>{
                        updateRequest(e).then((r)=>{
                            setEditModal(false);
                            refetch();
                        })
                    }}
                    layout={'vertical'}
                >
                    <Form.Item name={'id'} hidden><Input/></Form.Item>
                    <Form.Item name={'status'} label={'Статус заявки'}>
                        <Select className={s.select}>
                            {REQUEST_TYPES.map((t, i) => <Select.Option value={i} key={i}>{t}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name={'admin_comment'} label={'Информация о заявке'}>
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
