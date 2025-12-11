import * as React from 'react';

function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M20 80 V40 C20 25, 35 20, 50 20 C65 20, 80 25, 80 40 V80"
        stroke="currentColor"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M30 80 H70"
        stroke="currentColor"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M50 20 V50"
        stroke="currentColor"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default Logo;
