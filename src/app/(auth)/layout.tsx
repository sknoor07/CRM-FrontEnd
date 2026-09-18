export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50 to-primary-100 flex flex-col items-center justify-center p-4">
      {children}
    </div>
  );
}
