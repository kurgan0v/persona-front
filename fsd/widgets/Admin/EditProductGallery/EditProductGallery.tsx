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
            setImage(product.gallery ? product.gallery.filter(el => el).map((el, i) => ({
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
            //message.success('Галерея обновлена').then()
            //refetch();
        })
    }
    return(
            <div className={s.wrapper}>
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
                                                <CustomImage src={p.response ?? 'loader.svg'} alt={''} key={p.uid} fill/>
                                            </div>
                                        )}
                                    </Draggable>
                                )) : null}
                                {provided.placeholder}

                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
                <p className={s.clue}>Удерживайте <svg width="41" height="18" viewBox="0 0 41 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="0.5" y="0.5" width="40" height="17" rx="1.5" stroke="#A2A2A2"/>
                    <path d="M14.0059 10.7207C14.0059 11.2285 13.8789 11.6621 13.625 12.0215C13.375 12.377 13.0234 12.6484 12.5703 12.8359C12.1172 13.0234 11.584 13.1172 10.9707 13.1172C10.6465 13.1172 10.3398 13.1016 10.0508 13.0703C9.76172 13.0391 9.49609 12.9941 9.25391 12.9355C9.01172 12.877 8.79883 12.8047 8.61523 12.7188V11.7637C8.9082 11.8848 9.26562 11.998 9.6875 12.1035C10.1094 12.2051 10.5508 12.2559 11.0117 12.2559C11.4414 12.2559 11.8047 12.1992 12.1016 12.0859C12.3984 11.9688 12.623 11.8027 12.7754 11.5879C12.9316 11.3691 13.0098 11.1074 13.0098 10.8027C13.0098 10.5098 12.9453 10.2656 12.8164 10.0703C12.6875 9.87109 12.4727 9.69141 12.1719 9.53125C11.875 9.36719 11.4688 9.19336 10.9531 9.00977C10.5898 8.88086 10.2695 8.74023 9.99219 8.58789C9.71484 8.43164 9.48242 8.25586 9.29492 8.06055C9.10742 7.86523 8.96484 7.63867 8.86719 7.38086C8.77344 7.12305 8.72656 6.82812 8.72656 6.49609C8.72656 6.03906 8.8418 5.64844 9.07227 5.32422C9.30664 4.99609 9.62891 4.74609 10.0391 4.57422C10.4531 4.39844 10.9277 4.31055 11.4629 4.31055C11.9199 4.31055 12.3418 4.35352 12.7285 4.43945C13.1191 4.52539 13.4766 4.64062 13.8008 4.78516L13.4902 5.64062C13.1816 5.51172 12.8535 5.4043 12.5059 5.31836C12.1621 5.23242 11.8066 5.18945 11.4395 5.18945C11.0723 5.18945 10.7617 5.24414 10.5078 5.35352C10.2578 5.45898 10.0664 5.60938 9.93359 5.80469C9.80078 6 9.73438 6.23242 9.73438 6.50195C9.73438 6.80273 9.79688 7.05273 9.92188 7.25195C10.0508 7.45117 10.2539 7.62891 10.5312 7.78516C10.8125 7.9375 11.1836 8.09766 11.6445 8.26562C12.1484 8.44922 12.5762 8.64453 12.9277 8.85156C13.2793 9.05469 13.5469 9.30469 13.7305 9.60156C13.9141 9.89453 14.0059 10.2676 14.0059 10.7207ZM16.584 3.88281V6.60742C16.584 6.76367 16.5801 6.92188 16.5723 7.08203C16.5645 7.23828 16.5508 7.38281 16.5312 7.51562H16.5957C16.7285 7.28906 16.8965 7.09961 17.0996 6.94727C17.3066 6.79102 17.541 6.67383 17.8027 6.5957C18.0645 6.51367 18.3418 6.47266 18.6348 6.47266C19.1504 6.47266 19.5801 6.55469 19.9238 6.71875C20.2715 6.88281 20.5312 7.13672 20.7031 7.48047C20.8789 7.82422 20.9668 8.26953 20.9668 8.81641V13H20.0059V8.88086C20.0059 8.3457 19.8828 7.94531 19.6367 7.67969C19.3945 7.41406 19.0215 7.28125 18.5176 7.28125C18.041 7.28125 17.6602 7.37305 17.375 7.55664C17.0938 7.73633 16.8906 8.00195 16.7656 8.35352C16.6445 8.70508 16.584 9.13477 16.584 9.64258V13H15.6113V3.88281H16.584ZM23.9434 6.57812V13H22.9707V6.57812H23.9434ZM23.4688 4.17578C23.6289 4.17578 23.7656 4.22852 23.8789 4.33398C23.9961 4.43555 24.0547 4.5957 24.0547 4.81445C24.0547 5.0293 23.9961 5.18945 23.8789 5.29492C23.7656 5.40039 23.6289 5.45312 23.4688 5.45312C23.3008 5.45312 23.1602 5.40039 23.0469 5.29492C22.9375 5.18945 22.8828 5.0293 22.8828 4.81445C22.8828 4.5957 22.9375 4.43555 23.0469 4.33398C23.1602 4.22852 23.3008 4.17578 23.4688 4.17578ZM28.8652 7.33984H27.2656V13H26.293V7.33984H25.1562V6.87109L26.293 6.54883V6.12109C26.293 5.58203 26.373 5.14453 26.5332 4.80859C26.6934 4.46875 26.9258 4.21875 27.2305 4.05859C27.5352 3.89844 27.9062 3.81836 28.3438 3.81836C28.5898 3.81836 28.8145 3.83984 29.0176 3.88281C29.2246 3.92578 29.4062 3.97461 29.5625 4.0293L29.3105 4.79688C29.1777 4.75391 29.0273 4.71484 28.8594 4.67969C28.6953 4.64062 28.5273 4.62109 28.3555 4.62109C27.9844 4.62109 27.709 4.74219 27.5293 4.98438C27.3535 5.22266 27.2656 5.59766 27.2656 6.10938V6.57812H28.8652V7.33984ZM32.123 12.3203C32.2832 12.3203 32.4473 12.3066 32.6152 12.2793C32.7832 12.252 32.9199 12.2188 33.0254 12.1797V12.9355C32.9121 12.9863 32.7539 13.0293 32.5508 13.0645C32.3516 13.0996 32.1562 13.1172 31.9648 13.1172C31.625 13.1172 31.3164 13.0586 31.0391 12.9414C30.7617 12.8203 30.5391 12.6172 30.3711 12.332C30.207 12.0469 30.125 11.6523 30.125 11.1484V7.33984H29.2109V6.86523L30.1309 6.48438L30.5176 5.08984H31.1035V6.57812H32.9844V7.33984H31.1035V11.1191C31.1035 11.5215 31.1953 11.8223 31.3789 12.0215C31.5664 12.2207 31.8145 12.3203 32.123 12.3203Z" fill="#A2A2A2"/>
                </svg>
                    и крутите колесико мыши, чтобы листать галерею</p>
                <p className={s.subtitle}>Загруженные изображения</p>
                <UploadImage list={image} changeImage={changeImage} setFileList={setImage} maxLength={10}
                             multiple={true}/>
            </div>
    )
}
