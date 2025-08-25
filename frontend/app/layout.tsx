import { AuthProvider } from '@/hooks/useAuth'
import AuthLayout from '@/components/auth/AuthLayout'
import './globals.css'

export const metadata = {
  title: '東大受験アプリ',
  description: '東大受験のためのタスク管理アプリ',
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