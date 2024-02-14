import s from './EditProductGallery.module.scss';
import UploadImage from "@/fsd/shared/ui/UploadImage/UploadImage";
import {App, Form} from "antd";
import {useEffect, useState} from "react";
import {UploadFile} from "antd/es/upload/interface";
import {useMutation} from "react-query";
import {ProductUpdateGalleryFetcher} from "@/fsd/shared/api/products";
import {IProductDetail} from "@/fsd/entities/product/model";
import CustomImage from "@/fsd/shared/ui/CustomImage/CustomImage";
import {DragDropContext, Draggable, Droppable} from "@hello-pangea/dnd";
import PromoBlock from "@/fsd/entities/promo/components/PromoBlock/PromoBlock";
import Empty from "@/fsd/shared/ui/Empty/Empty";

interface EditProductGalleryProps{
    product?: IProductDetail
    refetch: any
    id: string
}
export default function EditProductGallery({product, refetch, id}: EditProductGalleryProps){
    const {message} = App.useApp();
    const {mutateAsync: updateGallery} = useMutation(ProductUpdateGalleryFetcher)
    const [image, setImage] = useState<UploadFile[]>([])
    useEffect(() => {
        if(product){
            setImage(product.gallery ? product.gallery.map(el => ({
                uid: /https/.test(el) ? el : el.split('.')[0],
                name: el,
                type: 'image/webp',
                status: 'done',
                url: /https/.test(el) ? el : `${process.env.APP_BASE_URL}/files/${el}`,
                response: el
            })) : [])
        }
    }, [product]);
    const changeImage = (fileName: string, fileList: UploadFile[]) => {
        const data = {
            id,
            gallery: fileList.map(f => f.response)
        }
        updateGallery(data).then(res => {
            message.success('Галерея обновлена').then()
            refetch();
        })
    }
    return(
        <>
            <Form.Item>
                <p className={s.subtitle}>Порядок вывода изображений</p>
                <DragDropContext onDragEnd={(result) => {
                    if(image && result.destination){
                        const items = [...image];
                        const [reorderedItem] = items.splice(result.source.index, 1);
                        items.splice(result.destination.index, 0, reorderedItem);
                        setImage(items)
                        updateGallery({id: id, gallery: items.map(el => el.response)}).then(res => {
                            message.success('Галерея обновлена')
                            refetch();
                        })
                    }
                }}>
                    <Droppable droppableId={'gallery'} direction={'horizontal'}>
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps} className={s.wrapperImages}>
                                {image && image.length ? image.map((p, i) => (
                                    <Draggable draggableId={p.uid} index={i} key={p.uid}>
                                        {(provided) => (
                                            <div
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                ref={provided.innerRef}
                                                className={s.image}
                                            >
                                                <CustomImage src={p.response} alt={''} key={p.uid} fill/>
                                            </div>
                                        )}
                                    </Draggable>
                                )) : null}
                                {provided.placeholder}

                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                <p className={s.subtitle}>Галерея</p>
                <UploadImage list={image} changeImage={changeImage} setFileList={setImage} maxLength={10}
                             multiple={true}/>
            </Form.Item>
        </>
    )
}
