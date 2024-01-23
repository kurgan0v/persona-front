import Image from "next/image";
export default function Logo(){
    return (
        <Image src={'/logo.png'} alt={'Логотип'} width={240} height={66}/>
    )
}
