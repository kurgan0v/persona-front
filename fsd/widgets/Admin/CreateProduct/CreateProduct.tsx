"use client";
import s from './CreateProduct.module.scss';
import {Button, Col, Form, Input, InputNumber, Row, Select, Switch} from "antd";
import {useMutation, useQuery} from "react-query";
import {SectionsAllFetcher} from "@/fsd/shared/api/section";
import {CaretDownFilled} from "@ant-design/icons";
import {useState} from "react";
import {ICategory} from "@/fsd/entities/category/model";
import {CategoriesFetcher} from "@/fsd/shared/api/category";
import {ProductCreateFetcher} from "@/fsd/shared/api/products";
import {useRouter} from "next/navigation";

export default function CreateProduct() {
    const {push} = useRouter();
    const [form] = Form.useForm();
    const [categories, setCategories] = useState<ICategory[] | undefined>();
    const {
        data: sections,
        isSuccess
    } = useQuery(['sections_all'], SectionsAllFetcher);
    const {mutateAsync: getCategories} = useMutation(CategoriesFetcher);
    const {mutateAsync: createProduct} = useMutation(ProductCreateFetcher);
    const {Option} = Select;
    return (
        <Form
            layout={'vertical'}
            onFinish={(e) => {
                createProduct(e).then(r => push(`/admin/product/${r.id}`));
            }}
            form={form}
        >
            <Row gutter={30}>
                <Col span={12}>

                        {isSuccess &&
                            <Form.Item label={'Раздел'}><Select suffixIcon={<CaretDownFilled/>} className={s.select} placeholder={'Выберите раздел'}
                                    onChange={(e) => {
                                        form.setFieldValue('category_id', '')
                                        getCategories(e).then(setCategories)
                                    }}>
                                {
                                    sections.filter(el => el.link).map(el => (
                                        <Option key={el.id} value={el.id}>{el.name}</Option>
                                    ))
                                }
                            </Select></Form.Item>}

                </Col>
                {categories && <Col span={12}><Form.Item name={'category_id'} label={'Категория'}><Select
                    suffixIcon={<CaretDownFilled/>} className={s.select} placeholder={'Выберите категорию'}
                >
                    {categories.map(el => (
                        <Option key={el.id} value={el.id}>{el.name}</Option>
                    ))}
                </Select></Form.Item></Col>}
            </Row>

            <Form.Item name={'title'} label={'Название'}>
                <Input maxLength={60} showCount/>
            </Form.Item>
            <Form.Item name={'basic_price'} label={'Базовая стоимость'}>
                <InputNumber controls={false} placeholder={"1000"}/>
            </Form.Item>
            <Form.Item name={'is_new'} label={'Отметить как новинку'} valuePropName={'checked'}>
                <Switch/>
            </Form.Item>
            <Form.Item>
                <Button type={'primary'} htmlType={'submit'}>Продолжить</Button>
            </Form.Item>
        </Form>
    )
}
