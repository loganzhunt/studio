interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8">
      {children}
    </main>
  );
}
