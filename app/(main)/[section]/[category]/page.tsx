import Category from "@/fsd/pages/Category/Category";

export default function Home({ params }: { params: { category: string , section: string} }) {
    return (
        <>
            <Category params={params}/>
        </>
    )
}
