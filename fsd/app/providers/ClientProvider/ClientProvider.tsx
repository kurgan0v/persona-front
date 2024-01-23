"use client";
import {QueryClient, QueryClientProvider} from "react-query";
import AntdThemeProvider from "@/fsd/app/providers/AntdThemeProvider/AntdThemeProvider";

export default function ClientProvider({
                                     children,
                                 }: {
    children: React.ReactNode
}) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                refetchOnWindowFocus: false,
            },
        },
    })
    return (
            <QueryClientProvider client={queryClient}>
                <AntdThemeProvider>
                    {children}
                </AntdThemeProvider>
            </QueryClientProvider>

    );
};

