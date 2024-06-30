"use client"
import Image from "next/image";
import {ImageProps} from "next/dist/shared/lib/get-img-props";
import {useState} from "react";

export interface ImagePropsCustom extends ImageProps {
    folderPrefix?: string
    disableLoading?: boolean
    webImage?: boolean
}

const CustomImage = (props: ImagePropsCustom) => {
    const [loaded, setLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const propsNew = {...props}
    propsNew.src =
        props.webImage
            ? propsNew.src
            : propsNew.src && !hasError
                ? /https/.test(`${propsNew.src}`)
                    ? propsNew.src
                    : `${process.env.APP_BASE_URL}/files/${props.folderPrefix ? props.folderPrefix + '/' : ''}${propsNew.src}`
                : '/placeholder.svg';
    propsNew.style = {
        ...propsNew.style,
        objectFit: propsNew.style?.objectFit ? propsNew.style?.objectFit : "cover"
    };
    propsNew.onLoad = (e) => setLoaded(true)
    propsNew.onError = (e) => setHasError(true)
    propsNew.loader = (loaded || props.disableLoading) ? undefined : () => '/loader.svg'
    delete propsNew.folderPrefix;

    return (
        <Image {...propsNew}/>
    );
};

export default CustomImage;
