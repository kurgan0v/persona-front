import {Metadata} from "next";
type Props = {
    params: { category: string , section: string, product: string};
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    return await fetch(`${process.env.APP_BASE_URL}/product/seo/${params.product}`).then((res) => res.json());
}
export default function Layout({children}: {children: React.ReactNode}) {
    return (
            <>{children}</>
    )
}
