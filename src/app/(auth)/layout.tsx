import type { ReactNode } from 'react';
import { Logo } from '@/components/core/Logo';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-6">
      <div className="mb-8">
        <Logo size="large" />
      </div>
      <main className="w-full max-w-md rounded-xl border bg-card p-6 shadow-xl sm:p-8">
        {children}
      </main>
      <p className="mt-8 text-center text-sm text-muted-foreground">
        Your personal finance journey starts here.
      </p>
    </div>
  );
}
