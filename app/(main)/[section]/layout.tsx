import {Metadata} from "next";
type Props = {
    params: { section: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    return await fetch(`${process.env.APP_BASE_URL}/section/seo/${params.section}`).then((res) => res.json());
}
export default function Layout({children}: {children: React.ReactNode}) {
    return (
            <>{children}</>
    )
}
