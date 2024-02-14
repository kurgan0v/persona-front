"use client";
import s from "./EditCategories.module.scss";
import {App, Button, Col, Form, Input, Modal, Popover, Row, Select, Switch} from "antd";
import UploadImage from "@/fsd/shared/ui/UploadImage/UploadImage";
import {useState} from "react";
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

export default function EditCategories() {
    const {message} = App.useApp();
    const [form] = Form.useForm();
    const [modalOpen, setModalOpen] = useState(false);
    const [section, setSection] = useState('');
    const [categories, setCategories] = useState<ICategory[] | undefined>()
    const [editingCategory, setEditingCategory] = useState<ICategory | undefined>();
    const {mutateAsync: getCategories} = useMutation(CategoriesFetcher);
    const [image, setImage] = useState<UploadFile[]>([])
    const {
        data: sections,
        isSuccess
    } = useQuery(['sections_all'], SectionsAllFetcher);
    const choseCategory = (cat: ICategory) => {
        setEditingCategory(cat)
        const data = {...cat};
        data.link = cat.link ?? cat.id;
        form.setFieldsValue(cat)
        setImage(cat.cover ? [{
            uid: '-1',
            name: cat.cover,
            status: 'done',
            url: `${process.env.APP_BASE_URL}/files/${cat.cover}`,
            response: cat.cover
        }] : [])
        setModalOpen(true);
    }

    const {mutateAsync: updateCategory} = useMutation(CategoryUpdateFetcher);
    const {mutateAsync: createCategory} = useMutation(CategoryCreateFetcher);
    const {mutateAsync: deleteCategory} = useMutation(CategoriesDeleteFetcher);
    const changeImage = (fileName: string, fileList: UploadFile[]) => {
        if (editingCategory) {
            const data = {
                id: editingCategory.id,
                cover: fileName
            }
            updateCategory(data).then(res => {
                message.success('Обложка категории обновлена').then()
                getCategories(section).then(r => setCategories(r));
            })
        }
    }
    const deleteCategoryConfirm = (categoryId: string) => {
        deleteCategory(categoryId).then(() => {
            getCategories(section).then(r => setCategories(r))
        });
    }
    const onFinishForm = async (values: CategoryUpdateCreateFetcherRequest) => {
        if (editingCategory) {
            updateCategory(values).then(r => {
                setEditingCategory(undefined);
                setModalOpen(false)
                getCategories(section).then(r => setCategories(r));
            }).catch(async (e) => {
                await message.error(e.response.data)
            })
        } else {
            const data = {...values};
            data.cover = image.length ? image[0]?.response : '';
            data.section_id = section;
            createCategory(data).then(r => {
                setEditingCategory(undefined);
                setModalOpen(false)
                getCategories(section).then(r => setCategories(r));
            }).catch(async (e) => {
                await message.error(e.response.data)
            });
        }
    }
    const addCategoryClick = () => {
        form.resetFields();
        setEditingCategory(undefined);
        setImage([]);
        setModalOpen(true);
    }
    const {Option} = Select;
    return (
        <div className={s.wrapper}>
            <div className={s.header}>
                <h2>Категории</h2>
                {section && <AddIcon onClick={addCategoryClick}/>}
            </div>
            <div className={s.categories}>
                <p>Раздел</p>
                {isSuccess &&
                    <Select suffixIcon={<CaretDownFilled/>} className={s.sections} placeholder={'Выберите раздел'}
                            onChange={(e) => {
                                setSection(e)
                                getCategories(e).then(r => setCategories(r))
                            }}>
                        {
                            sections.filter(el => el.link).map(el => (
                                <Option key={el.id} value={el.id}>{el.name}</Option>
                            ))
                        }
                    </Select>}
                {categories ? categories.length ? categories.map(c => (
                    <CategoryAdmin key={c.id} category={c} onEditClick={() => {
                        choseCategory(c)
                    }} onDeleteClick={() => deleteCategoryConfirm(c.id)}/>
                )) : <Empty title={'В этом разделе пока нет категорий'}/> : null}
            </div>
            <Modal
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                footer={null}
                title={editingCategory ? 'Редактирование категории' : 'Новая категория'}
            >
                <Form
                    form={form}
                    layout={'vertical'}
                    onFinish={onFinishForm}
                >
                    {editingCategory && <Form.Item name={'id'} hidden><Input/></Form.Item>}

                    <Form.Item label={'Обложка категории'}>
                        <UploadImage list={image} changeImage={changeImage} setFileList={setImage}/>
                    </Form.Item>
                    {editingCategory && <Form.Item name={'section_id'} label={'Раздел'}>
                        <Select suffixIcon={<CaretDownFilled/>} className={s.select}>
                            {isSuccess && sections.filter(el => el.link).map(el => (
                                <Option key={el.id} value={el.id}>{el.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>}
                    <Form.Item name={'name'} label={'Отображаемое название'} rules={[
                        {
                            required: true,
                            message: 'Это обязательное поле'
                        }
                    ]}>
                        <Input placeholder={'Пиджаки'}/>
                    </Form.Item>
                    <Form.Item name={'link'} label={'Cсылка'}>
                        <Input showCount placeholder={'jackets'}/>
                    </Form.Item>
                    <Row gutter={30}>
                        <Col span={11}>
                            <Form.Item name={'visible'} label={'Отображать категорию'} valuePropName={'checked'}>
                                <Switch/>
                            </Form.Item>
                        </Col>
                        <Col span={13}>
                            <Form.Item name={'show_size_chart'} label={'Показывать размерную сетку'}
                                       valuePropName={'checked'}>
                                <Switch/>
                            </Form.Item>
                        </Col>
                    </Row>
                    {editingCategory?.id && <CategoryCharacteristics categoryId={editingCategory.id}/>}
                    {editingCategory?.id && <CategorySizes categoryId={editingCategory.id}/>}
                    <Form.Item name={'seo_title'} label={'SEO заголовок'}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={'seo_description'} label={'SEO описание'}>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={'seo_keywords'} label={'Ключевые слова'}>
                        <Input/>
                    </Form.Item>
                    <Form.Item>
                        <Button type={'primary'} htmlType={'submit'}>Сохранить</Button>
                    </Form.Item>
                </Form>
            </Modal>

        </div>
    )
}
