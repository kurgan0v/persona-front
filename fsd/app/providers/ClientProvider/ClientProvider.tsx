"use client";
import {QueryClient, QueryClientProvider} from "react-query";
import AntdThemeProvider from "@/fsd/app/providers/AntdThemeProvider/AntdThemeProvider";
import {message} from "antd";

export default function ClientProvider({
                                     children,
                                 }: {
    children: React.ReactNode
}) {
    const [messageApi, contextHolder] = message.useMessage();
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                refetchOnWindowFocus: false,
                onError: async (err: any) => {
                    if(err.request.status === 500){
                        messageApi.error(err.response.data)
                    }
                }
            },
            mutations: {
                onError: async (err: any) => {
                    if(err.request.status === 500){
                        messageApi.error(err.response.data)
                    }
                }
            }
        },
    })
    return (
            <QueryClientProvider client={queryClient}>
                {contextHolder}
                <AntdThemeProvider>
                    {children}
                </AntdThemeProvider>
            </QueryClientProvider>

    );
};

