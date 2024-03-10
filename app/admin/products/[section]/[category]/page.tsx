import Products from "@/fsd/pages/Admin/Products/Products";

export default function Page({params}: {params: {section: string, category: string}}){
    return(
        <Products params={params}/>
    )
}
