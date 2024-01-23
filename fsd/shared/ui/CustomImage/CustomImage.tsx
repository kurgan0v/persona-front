import Image from "next/image";
import {ImageProps} from "next/dist/shared/lib/get-img-props";

export interface ImagePropsCustom extends ImageProps{
    folderPrefix?: string
}
const CustomImage = (props:ImagePropsCustom) => {
    const propsNew = {...props}
    propsNew.src = propsNew.src ? /https/.test(`${propsNew.src}`) ? propsNew.src : `${process.env.APP_BASE_URL}/files/${props.folderPrefix ? props.folderPrefix + '/' : ''}${propsNew.src}` : '/placeholder.svg';
    propsNew.style = {
        ...propsNew.style,
        objectFit: "cover"
    };
    delete propsNew.folderPrefix;
    return (
        <Image {...propsNew}/>
    );
};

export default CustomImage;
