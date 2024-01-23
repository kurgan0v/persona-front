import Detail from "@/fsd/pages/Detail/Detail";
export default function Page({params}: {params: {product: string}}) {
    return (
        <>
            <Detail productId={params.product}/>
        </>
    )
}
