import Category from "@/fsd/pages/Category/Category";
import {Suspense} from "react";

export default function Home({ params }: { params: { category: string , section: string} }) {
    return (
        <Suspense>
            <Category params={params}/>
        </Suspense>
    )
}
