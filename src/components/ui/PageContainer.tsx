interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return (
    <div className={`max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 ${className}`}>
      {children}
    </div>
  );
} 