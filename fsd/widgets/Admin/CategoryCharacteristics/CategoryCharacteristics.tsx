import s from './CategoryCharacteristics.module.scss';
import {Button, Form, Input, Modal, Popconfirm, Switch} from "antd";
import {useEffect, useState} from "react";
import AddIcon from "@/fsd/shared/ui/icons/AddIcon/AddIcon";
import FilterIcon from "@/fsd/shared/ui/icons/FilterIcon/FilterIcon";
import {clsx} from "clsx";
import EditIcon from "@/fsd/shared/ui/icons/EditIcon/EditIcon";
import {ICharacteristicType} from "@/fsd/entities/characteristics/model";
import {useMutation} from "react-query";
import {
    CharacteristicCreateOrUpdateFetcher, CharacteristicDeleteFetcher,
    CharacteristicsByCategoryFetcher,
    CharacteristicsTypeCreateOrUpdateFetcher, CharacteristicsTypeDeleteFetcher
} from "@/fsd/shared/api/characteristics";
import {QuestionCircleOutlined} from "@ant-design/icons";
export default function CategoryCharacteristics({categoryId}: {categoryId: string}){
    const [info, setInfo] = useState<ICharacteristicType[]>([]);
    const [characteristicTypeForm] = Form.useForm();
    const [characteristicForm] = Form.useForm();
    const [openCharacteristicTypeModal, setOpenCharacteristicTypeModal] = useState(false);
    const [openCharacteristicModal, setOpenCharacteristicModal] = useState(false);
    const [editingCharacteristicType, setEditingCharacteristicType ] = useState('');
    const [editingCharacteristic, setEditingCharacteristic ] = useState('');
    const {mutateAsync: getCharacteristics, isSuccess} = useMutation(CharacteristicsByCategoryFetcher)
    const {mutateAsync: createOrUpdateCharacteristicType} = useMutation(CharacteristicsTypeCreateOrUpdateFetcher);
    const {mutateAsync: createOrUpdateCharacteristic} = useMutation(CharacteristicCreateOrUpdateFetcher);
    const {mutateAsync: deleteCharacteristicType} = useMutation(CharacteristicsTypeDeleteFetcher);
    const {mutateAsync: deleteCharacteristic} = useMutation(CharacteristicDeleteFetcher);
    useEffect(() => {
        if(categoryId){
            getCharacteristics(categoryId).then(setInfo)
        }
    }, [categoryId]);
    return(
        <div>
            {isSuccess && <Form.Item>
                <div className={s.characteristicsTypesHeader}>
                    <h3 className={s.characteristicsTypesTitle}>Характеристики</h3>
                    <AddIcon onClick={()=> {
                        characteristicTypeForm.resetFields();
                        characteristicTypeForm.setFieldValue('category', categoryId)
                        setOpenCharacteristicTypeModal(true)
                        setEditingCharacteristicType('');
                    }}/>
                </div>
                <div className={s.characteristicsTypes}>
                    {info.length ? info.map(ch => (
                        <div key={ch.id} className={s.characteristicsType}>
                            <div className={s.characteristicHeader}>
                                <FilterIcon className={clsx(ch.is_filtered && s.activeIcon, !ch.is_filtered && s.disabledIcon)}/>
                                <p>{ch.name}</p>
                                <EditIcon onClick={()=>{
                                    characteristicTypeForm.setFieldsValue(ch);
                                    setOpenCharacteristicTypeModal(true)
                                    setEditingCharacteristicType(ch.id);
                                }}/>
                                {/*<Delete description={'При удалении характеристики будут удалены все её значения у всех связанных продуктов. Продолжить?'} onConfirm={()=>console.log('Удалить')}/>*/}
                            </div>
                            <div className={s.characteristics}>
                                {ch.characteristics.length ? ch.characteristics.map(c => (
                                    <div key={c.id} className={s.characteristic}>
                                        <p>{c.name}</p>
                                        <EditIcon onClick={()=>{
                                            characteristicForm.setFieldsValue(c);
                                            setOpenCharacteristicModal(true);
                                            setEditingCharacteristic(c.id)
                                        }}/>
                                        {/*<Delete description={'Это значение характеристики будет удалено у продуктов в данной категории. Продолжить?'} onConfirm={()=>console.log('Удалить')}/>*/}
                                    </div>
                                )) : <p>У характеристики пока нет значений</p>}<AddIcon onClick={()=> {
                                characteristicForm.resetFields();
                                characteristicForm.setFieldValue('type', ch.id)
                                setOpenCharacteristicModal(true)
                                setEditingCharacteristic('')
                            }}/>
                            </div>
                        </div>
                    )) : <p>У категории пока нет характеристик</p>}
                </div>
            </Form.Item>}
            <Modal
                open={openCharacteristicTypeModal}
                onCancel={()=>setOpenCharacteristicTypeModal(false)}
                footer={null}
                title={`${editingCharacteristicType ? 'Редактировать' : 'Добавить'} характеристику`}
            >
                <Form
                    layout={'vertical'}
                    form={characteristicTypeForm}
                    onFinish={(e)=>{
                        createOrUpdateCharacteristicType(e).then((r) => {
                            getCharacteristics(categoryId).then(setInfo)
                            setOpenCharacteristicTypeModal(false)
                        })
                    }}
                >
                    <Form.Item name={'id'} hidden>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={'category'} hidden>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={'name'} label={'Отображаемое название'}>
                        <Input placeholder={'Материал'}/>
                    </Form.Item>
                    <Form.Item name={'is_filtered'} label={'Использовать характеристику в фильтрах'} valuePropName={'checked'}>
                        <Switch/>
                    </Form.Item>
                    <Form.Item>
                        <div className={s.btns}>
                            <Button type={'primary'} htmlType={'submit'}>{editingCharacteristicType ? 'Сохранить' : 'Добавить'}</Button>
                            {editingCharacteristicType &&
                                <Popconfirm
                                    title={'Все значения категории будут удалены. Продолжить?'}
                                    onConfirm={()=>{
                                        deleteCharacteristicType(editingCharacteristicType).then(res => {
                                            getCharacteristics(categoryId).then(setInfo)
                                            setOpenCharacteristicTypeModal(false)
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
            <Modal
                open={openCharacteristicModal}
                onCancel={()=>setOpenCharacteristicModal(false)}
                footer={null}
                title={`${editingCharacteristic ? 'Редактировать' : 'Добавить'} значение`}
            >
                <Form
                    layout={'vertical'}
                    form={characteristicForm}
                    onFinish={(e)=>{
                        createOrUpdateCharacteristic(e).then((r) => {
                            getCharacteristics(categoryId).then(setInfo)
                            setOpenCharacteristicModal(false)
                            characteristicForm.resetFields()
                        })
                    }}
                >
                    <Form.Item name={'id'} hidden>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={'type'} hidden>
                        <Input/>
                    </Form.Item>
                    <Form.Item name={'name'} label={'Отображаемое название'}>
                        <Input/>
                    </Form.Item>
                    <Form.Item>
                        <div className={s.btns}>
                            <Button type={'primary'} htmlType={'submit'}>{editingCharacteristic ? 'Сохранить' : 'Добавить'}</Button>
                            {editingCharacteristic &&
                                <Popconfirm
                                    title={'Значение будет удалено. Продолжить?'}
                                    onConfirm={()=>{
                                        deleteCharacteristic(editingCharacteristic).then(res => {
                                            getCharacteristics(categoryId).then(setInfo)
                                            setOpenCharacteristicModal(false)
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
