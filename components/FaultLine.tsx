export default function FaultLine({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`fault-line ${className}`}
      viewBox="0 0 1200 12"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 6 L80 5 L140 8 L220 4 L310 7 L400 3 L480 8 L560 5 L650 9 L740 4 L820 7 L900 3 L980 8 L1060 5 L1140 7 L1200 6"
        fill="none"
        stroke="rgba(26,28,30,0.15)"
        strokeWidth="1"
      />
    </svg>
  )
}
