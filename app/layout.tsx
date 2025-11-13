import '@ant-design/v5-patch-for-react-19';
import type { Metadata } from "next";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider } from 'antd';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/components/providers/AuthProvider';
import "./globals.css";

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_COMPANY_NAME || 'Company'} - Careers`,
  description: `Join ${process.env.NEXT_PUBLIC_COMPANY_NAME || 'our team'}. Browse open positions.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Khmer:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          <LanguageProvider>
            <AntdRegistry>
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: '#1890ff',
                    borderRadius: 8,
                    fontFamily: '"Noto Serif Khmer", serif',
                  },
                }}
              >
                {children}
              </ConfigProvider>
            </AntdRegistry>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
