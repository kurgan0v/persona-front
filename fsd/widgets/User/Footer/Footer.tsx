"use client";
import s from './Footer.module.scss';
import Link from "next/link";
import {useState} from "react";
import {Modal} from "antd";
import {IInfo} from "@/fsd/entities/info/model";
import ModalInfo from "@/fsd/entities/info/components/ModalInfo/ModalInfo";
import Instagram from "@/fsd/shared/ui/icons/Instagram/Instagram";
import VK from "@/fsd/shared/ui/icons/VK/VK";
import {useQuery} from "react-query";
import {InfoFetcher} from "@/fsd/shared/api/info";

const Footer = () => {
    const {data, isSuccess} = useQuery(['footer'], InfoFetcher);
    const [openInfo, setOpenInfo] = useState<IInfo | undefined>();
    return (
        <div className={s.wrapper}>
            <div className={s.content}>
                <div className={s.footer}>
                    <Link href={'/'}>
                        <img className={s.logo} src={'/logo.png'} alt={'Ателье'}/>
                    </Link>
                    <div className={s.links}>
                        {data?.info.slice(0, Math.round(data?.info.length/2)).map((inf)=>(
                            <p className={s.link} key={inf.id} onClick={()=>setOpenInfo(inf)}>{inf.name}</p>
                        ))}
                    </div>
                    <div className={s.links}>
                        {data?.info.slice(Math.round(data?.info.length/2)).map((inf)=>(
                            <p className={s.link} key={inf.id} onClick={()=>setOpenInfo(inf)}>{inf.name}</p>
                        ))}
                    </div>
                    <div className={s.contacts}>
                        <a href={`tel:${data?.phone.replace(/[^0-9+]/gi, '')}`} className={s.link}>{data?.phone}</a>
                        <a href={`mailto:${data?.email}`} className={s.link}>{data?.email}</a>
                        <div className={s.socials}>
                            {data?.vk && <a href={data?.vk} target={'_blank'}><Instagram className={s.social}/></a>}
                            {data?.instagram && <a href={data?.instagram} target={'_blank'}><VK className={s.social}/></a>}
                        </div>
                    </div>
                </div>
                <div className={s.info}>
                    <p>ООО «Статус» ИНН 6453132969 ОГРН 1146453000583 </p>
                    <Link target={'_blank'} href={'/privacy-policy.pdf'}>Политика конфиденциальности</Link>
                    <Link target="_blank" href="/agreement.pdf">Согласие на обработку персональных данных</Link>
                    <Link target={'_blank'} href="/Оферта.pdf">Публичная оферта</Link>
                </div>
            </div>
            <Modal
                open={!!openInfo}
                onCancel={()=>setOpenInfo(undefined)}
                footer={[]}
                width={'60rem'}
                bodyStyle={{
                    padding: '2rem'
                }}
            >
                {
                    openInfo && <ModalInfo info={openInfo}/>
                }
            </Modal>
        </div>
    );
};

export default Footer;
