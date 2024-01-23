import SectionPage from "@/fsd/pages/SectionPage/SectionPage";

export default function Page({ params }: { params: { section: string }}) {
    return (
        <>
            <SectionPage section={params.section}/>
        </>
    );
};

