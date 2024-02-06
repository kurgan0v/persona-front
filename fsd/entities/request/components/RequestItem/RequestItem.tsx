import s from './RequestItem.module.scss';
import {IRequest} from "@/fsd/entities/request/model";
import CustomImage from "@/fsd/shared/ui/CustomImage/CustomImage";
import {REQUEST_TYPE, REQUEST_TYPES} from "@/fsd/app/const";
import dayjs from "dayjs";
import {clsx} from "clsx";
import {CaretRightOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import {UploadFile} from "antd/es/upload/interface";
import {Modal} from "antd";
import EditIcon from "@/fsd/shared/ui/icons/EditIcon/EditIcon";
import Link from "next/link";
interface RequestItemProps{
    request: IRequest
    setEditModal: ()=>void
}
export default function RequestItem({request, setEditModal}: RequestItemProps){
    const status = [s.new, s.processing, s.closed, s.spam];
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [open, setOpen] = useState(false);

    return(
        <div className={s.wrapper}>
            <div className={s.headerWrapper}>
                <p className={s.requestType}>{REQUEST_TYPE[request.type]}</p>
                <div className={s.header}>
                    <div className={s.headerContent} onClick={()=>{setOpen(!open)}}>
                        <div><p className={clsx(s.status, status[request.status])}>{REQUEST_TYPES[request.status]}</p></div>
                        <div className={s.info}>{request.name}</div>
                        <div className={s.info}>{request.phone}</div>
                        <div>{dayjs(request.createdAt).format('DD.MM.YYYY HH:mm')}</div>
                        <CaretRightOutlined className={clsx(s.arrow, open && s.active)} />
                    </div>
                    <EditIcon onClick={setEditModal}/>
                </div>
            </div>
            <div className={clsx(s.details, open && s.active)}>
                {request.type === 0 ? <>
                    {request.comment &&  <p><b>Комментарий пользователя: </b>{request.comment}</p>}
                    {request.admin_comment &&  <p><b>Описание заявки: </b>{request.admin_comment}</p>}
                    {!!request.attachments?.length && <div className={s.images}>
                        {request.attachments.map(el => (
                            <CustomImage className={s.img} onClick={()=>{
                                setPreviewImage(el);
                                setPreviewOpen(true);
                            }} folderPrefix={'requests'} key={el} src={el} alt={''} width={200} height={200}/>
                        ))}
                    </div>}
                </> : <Link target={'_blank'} href={`/admin/product/${request.product_id}`}>
                    <div className={s.product}>
                        <CustomImage style={{objectFit: 'contain'}} src={request.product.gallery[0] ? request.product.gallery[0] : ''} width={50} height={50} alt={''}/>
                        <h3>{request.product.title}</h3>
                    </div>
                </Link>}
            </div>
            <Modal open={previewOpen} footer={null} onCancel={()=>setPreviewOpen(false)}>
                <CustomImage className={s.preview} folderPrefix={'requests'} src={previewImage} alt={''} width={600} height={600}/>
            </Modal>
        </div>
    )
}
