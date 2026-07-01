import type { Metadata } from 'next';
import ThemeProviderWrapper from './theme-provider';
import './globals.css';

export const metadata: Metadata = {
  title: '短剧工坊 - AI驱动的短剧制作平台',
  description: '从角色设定到视频生成，一站式短剧创作工具。专业人物设定、场景设定、剧本设定，社区共创，让创作更简单。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&family=Noto+Sans+SC:wght@400;500;700;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ThemeProviderWrapper>
          {children}
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
