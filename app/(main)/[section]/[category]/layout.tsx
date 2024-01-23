import {Metadata} from "next";
type Props = {
    params: { category: string , section: string};
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    return await fetch(`${process.env.APP_BASE_URL}/category/seo/${params.category}`).then((res) => res.json());
}
export default function Layout({children}: {children: React.ReactNode}) {
    return (
            <>{children}</>
    )
}
