import UserLayout from "@/fsd/app/providers/UserLayout/UserLayout";


export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <UserLayout>
            {children}
        </UserLayout>
    )
}
