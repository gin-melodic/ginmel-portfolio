import type { ComponentPropsWithoutRef } from 'react';

export interface GithubIconProps extends ComponentPropsWithoutRef<'svg'> {
  size?: number | string;
}

export const GithubIcon = ({ size = 24, className = "", ...props }: GithubIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.24c3-.34 6-1.53 6-6.76a5.2 5.2 0 0 0-1.4-3.6 4.9 4.9 0 0 0-.1-3.6s-1.1-.35-3.5 1.25a12.1 12.1 0 0 0-6.4 0C6.1 2.5 5 2.85 5 2.85a4.9 4.9 0 0 0-.1 3.6A5.2 5.2 0 0 0 3.5 10c0 5.2 3 6.4 6 6.74-.7.6-1 1.6-1 2.8v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);
