import { cn } from '@undp/design-system-react/cn';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'tertiary';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, ...props }, ref) => {
    const Comp = 'button';
    return (
      <Comp
        {...props}
        className={cn(
          'normal-case poppins-semibold !text-[16px] cursor-pointer opacity-100',
          variant === 'tertiary'
            ? 'hover:opacity-80'
            : 'px-7 py-3 rounded-full shadow-[0_4px_4px_rgba(0,0,0,0.25)]',
          variant === 'secondary'
            ? 'bg-[#fff] text-[#124E6F] hover:bg-[#DEF7FF]'
            : variant === 'primary'
              ? 'bg-[#4B6E91] text-[var(--color-text-white)] hover:bg-[#2A3F53]'
              : 'bg-transparent text-[var(--color-text-white)]',
          className,
        )}
        ref={ref}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button };
