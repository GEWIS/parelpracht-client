interface Props {
  startAngle: number;
  endAngle: number;
  fillColor?: string;
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegr: number) {
  const angleInRadians = ((angleInDegr - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  const d = ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');

  return d;
}

function PartialCircle(props: Props) {
  const { startAngle, endAngle, fillColor = 'none' } = props;

  if (startAngle < 0 || startAngle >= 360) {
    throw new TypeError(`Start angle should be in the range "0 <= startAngle < 360. Actual value: ${startAngle}`);
  }
  if (endAngle < 0 || endAngle >= 360) {
    throw new TypeError(`End angle should be in the range "0 <= endAngle < 360. Actual value: ${endAngle}`);
  }

  return (
    <svg>
      <path fill={fillColor} stroke="#446688" strokeWidth="2" d={describeArc(7, 7, 6, startAngle, endAngle)} />
    </svg>
  );
}

export default PartialCircle;
