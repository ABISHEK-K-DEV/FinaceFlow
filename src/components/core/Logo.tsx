import { PiggyBank } from 'lucide-react';
import Link from 'next/link';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  showText?: boolean;
}

export function Logo({ size = 'medium', className = '', showText = true }: LogoProps) {
  const iconSize = size === 'small' ? 20 : size === 'medium' ? 28 : 36;
  const textSize = size === 'small' ? 'text-lg' : size === 'medium' ? 'text-2xl' : 'text-3xl';

  return (
    <Link href="/dashboard" className={`flex items-center gap-2 ${className}`}>
      <PiggyBank className="text-primary" size={iconSize} strokeWidth={2.5} />
      {showText && <span className={`font-bold ${textSize} text-foreground`}>FinanceFlow</span>}
    </Link>
  );
}
