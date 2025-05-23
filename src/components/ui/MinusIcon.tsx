import React from 'react';

interface MinusIconProps extends React.SVGProps<SVGSVGElement> {}

const MinusIcon = (props: MinusIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="size-6"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12h14"
      />
    </svg>
  );
};

export default MinusIcon; 