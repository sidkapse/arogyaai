type Props = {
  pct: number; // 0..100
  size?: number;
  stroke?: number;
  color?: string;
  children?: React.ReactNode;
};

export function ProgressRing({ pct, size = 56, stroke = 5, color = '#10b981', children }: Props) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="#e2e8f0" strokeWidth={stroke}
      />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
      {children && (
        <foreignObject x={0} y={0} width={size} height={size}>
          <div
            style={{ width: size, height: size }}
            className="flex items-center justify-center rotate-90 text-xs font-semibold"
          >
            {children}
          </div>
        </foreignObject>
      )}
    </svg>
  );
}
