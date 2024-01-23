import React from "react";
import AdminLayout from "@/fsd/app/providers/AdminLayout/AdminLayout";
export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <>
            <AdminLayout>
                {children}
            </AdminLayout>
        </>
    )
}
