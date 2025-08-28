import { AuthProvider } from '@/hooks/useAuth'
import AuthLayout from '@/components/auth/AuthLayout'
import './globals.css'

export const metadata = {
  title: '東大柱育成アプリ',
  description: '東大柱育成のためのタスク管理アプリ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>
          <AuthLayout>
            {children}
          </AuthLayout>
        </AuthProvider>
      </body>
    </html>
  )
}