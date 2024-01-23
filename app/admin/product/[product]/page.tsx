import ProductEditing from "@/fsd/pages/Admin/ProductEditing/ProductEditing";

export default function Page({params}:{params:{product: string}}){
    return(
        <ProductEditing id={params.product}/>
    )
}
