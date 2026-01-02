export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-cream-50 to-sage-100 flex items-center justify-center p-6">
      <div className="absolute inset-0 pattern-grid opacity-30" />
      {children}
    </div>
  )
}

