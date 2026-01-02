import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: 'Jessica Fisioterapia | Cuidamos do seu bem-estar',
  description: 'Clínica de fisioterapia especializada em reabilitação, tratamento de dor e recuperação física. Marque a sua consulta hoje.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body className="bg-cream-50 text-sage-900 antialiased">
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#333d33',
              color: '#f9f6f0',
              borderRadius: '12px',
            },
          }}
        />
      </body>
    </html>
  )
}

