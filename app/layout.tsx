import './globals.css'
import { Inter } from 'next/font/google' // 'fontm' ko 'font' kar diya

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Nexus AI Insight Engine',
  description: 'Multi-Agent Research System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}