import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Material Memory Simulator',
  description: '自然素材の非線形遅延特性シミュレーションアプリ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
