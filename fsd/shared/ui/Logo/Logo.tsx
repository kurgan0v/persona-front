import Image from "next/image";
export default function Logo({className}:{className?: string}){
    return (
        <Image className={className} src={'/logo.png'} alt={'Логотип'} width={240} height={66}/>
    )
}
