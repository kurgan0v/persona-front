"use client";
import s from './CreateProduct.module.scss';
import {App, Button, Col, Form, Input, InputNumber, Row, Select, Switch} from "antd";
import {useMutation, useQuery} from "react-query";
import {SectionsAllFetcher} from "@/fsd/shared/api/section";
import {CaretDownFilled} from "@ant-design/icons";
import {useState} from "react";
import {ICategory} from "@/fsd/entities/category/model";
import {CategoriesFetcher} from "@/fsd/shared/api/category";
import {ProductCreateFetcher} from "@/fsd/shared/api/products";
import {useRouter} from "next/navigation";

export default function CreateProduct() {
    const {message} = App.useApp();
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
                createProduct(e).then(r => {
                    message.success('Товар создан')
                    push(`/admin/product/${r.id}`)
                });
            }}
            form={form}
        >
            <div className={s.selects}>
                <div>
                    <Form.Item label={'Раздел'} name={'section_id'} rules={[
                        {
                            required: true,
                            message: 'Это обязательное поле'
                        }
                    ]}>
                        {isSuccess &&
                            <Select suffixIcon={<CaretDownFilled/>} className={s.select} placeholder={'Выберите раздел'}
                                    onChange={(e) => {
                                        form.setFieldValue('category_id', '')
                                        getCategories(e).then(setCategories)
                                    }}>
                                {
                                    sections.map(el => (
                                        <Option key={el.id} value={el.id}>{el.name}</Option>
                                    ))
                                }
                            </Select>}</Form.Item>
                </div>
                <div>{categories && <Form.Item name={'category_id'} label={'Категория'} rules={[
                    {
                        required: true,
                        message: 'Это обязательное поле'
                    }
                ]}><Select
                    suffixIcon={<CaretDownFilled/>} className={s.select} placeholder={'Выберите категорию'}
                >
                    {categories.map(el => (
                        <Option key={el.id} value={el.id}>{el.name}</Option>
                    ))}
                </Select></Form.Item>}</div>
            </div>

            <Form.Item name={'title'} label={'Название'} rules={[
                {
                    required: true,
                    message: 'Это обязательное поле'
                }
            ]}>
                <Input  showCount placeholder={'Рубашка белая'}/>
            </Form.Item>
            <Form.Item name={'basic_price'} label={'Базовая стоимость'} rules={[
                {
                    required: true,
                    message: 'Это обязательное поле'
                }
            ]}>
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
