import { cn } from '@undp/design-system-react/cn';
import { H1, H2, H3, P } from '@undp/design-system-react/Typography';

interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  marginBottom?: 'none' | '3xs' | '2xs' | 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  size?: 'xs' | 'sm' | 'base' | 'base-responsive' | 'lg' | 'xl';
  weight?: 'light' | 'regular' | 'medium' | 'semibold' | 'bold';
  leading?: 'none' | 'snug' | 'normal' | 'loose';
  alignment?: 'left' | 'center' | 'right';
}

export const ParagraphText = ({
  children,
  className,
  size = 'base',
  marginBottom = 'none',
  weight = 'regular',
  leading = 'normal',
  alignment = 'left',
  ...props
}: ParagraphProps) => {
  return (
    <P
      {...props}
      className={cn(
        `poppins-${weight} text-${alignment} text-[var(--color-text-white)]`,
        leading === 'none'
          ? '!leading-none'
          : leading === 'snug'
            ? '!leading-[120%]'
            : leading === 'loose'
              ? '!leading-[160%]'
              : '!leading-[140%]',
        className,
      )}
      size={size}
      marginBottom={marginBottom}
    >
      {children}
    </P>
  );
};
interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  type: 'h1' | 'h2' | 'h3';
  weight?: 'light' | 'regular' | 'medium' | 'semibold' | 'bold';
  leading?: 'none' | 'snug' | 'normal' | 'loose';
  marginBottom?: 'none' | '2xs' | 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  alignment?: 'left' | 'center' | 'right';
}

export const HeadingText = ({
  children,
  className,
  type = 'h3',
  marginBottom = 'none',
  weight,
  alignment,
  ...props
}: HeadingProps) => {
  if (type === 'h1')
    return (
      <H1
        {...props}
        className={cn(
          `poppins-${weight || 'bold'} text-${alignment || 'center'} !text-[44px] text-[var(--color-text-white)]`,
          className,
        )}
        marginBottom={marginBottom}
      >
        {children}
      </H1>
    );
  if (type === 'h2')
    return (
      <H2
        {...props}
        className={cn(
          `poppins-${weight || 'bold'} text-${alignment || 'left'} !text-[24px] text-[var(--color-text-white)]`,
          className,
        )}
        marginBottom={marginBottom}
      >
        {children}
      </H2>
    );
  return (
    <H3
      {...props}
      className={cn(
        `poppins-${weight || 'semibold'} text-${alignment || 'left'} !text-[20px] text-[var(--color-text-white)]`,
        className,
      )}
      marginBottom={marginBottom}
    >
      {children}
    </H3>
  );
};
