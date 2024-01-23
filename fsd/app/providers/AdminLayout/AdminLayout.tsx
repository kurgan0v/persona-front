import s from './AdminLayout.module.scss';
import React from "react";
import AdminSidebar from "@/fsd/widgets/Admin/AdminSidebar/AdminSidebar";

const AdminLayout = ({
                         children,
                     }: {
    children: React.ReactNode
}) => {
    return (
            <div className={s.layout}>
                <div className={s.wrapper}>
                    <AdminSidebar/>
                    <div className={s.contentMain}>
                        {children}
                    </div>
                </div>
            </div>
    );
};

export default AdminLayout;
