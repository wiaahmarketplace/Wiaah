interface VerifiedBadgeProps {
  className?: string;
}

export function VerifiedBadge({ className = "w-4 h-4" }: VerifiedBadgeProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L15.09 5.09L19.18 6.18L20.27 10.27L23.36 13.36L20.27 16.45L19.18 20.54L15.09 21.63L12 24.72L8.91 21.63L4.82 20.54L3.73 16.45L0.64 13.36L3.73 10.27L4.82 6.18L8.91 5.09L12 2Z"
        fill="#10B981"
      />
      <path
        d="M10.5 13.5L8.5 11.5L7 13L10.5 16.5L17 10L15.5 8.5L10.5 13.5Z"
        fill="white"
      />
    </svg>
  );
}
