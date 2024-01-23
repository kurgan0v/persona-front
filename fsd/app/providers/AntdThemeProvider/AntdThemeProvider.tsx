import {ConfigProvider} from "antd";
import locale from 'antd/locale/ru_RU';
import { App } from 'antd';
export default function AntdThemeProvider({children}:{children: React.ReactNode}){
    return (
        <ConfigProvider
            locale={locale}
            theme={{
                token: {
                    colorPrimary: '#FF735C',
                    colorLink: '#FF735C',
                    colorLinkHover: '#FF735C',
                    colorPrimaryHover: '#d95b45',
                    colorTextBase: '#0B1E27',
                    borderRadius: 3,
                    fontFamily: `'Open Sans', sans-serif`,
                    fontSize: 16
                },
            }}
        >
            <App>
                {children}
            </App>
        </ConfigProvider>

    )
}
