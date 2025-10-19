import { scaleLinear } from 'd3-scale';
import { arc } from 'd3-shape';

interface Props {
  data: number[];
  radius: number;
  colors: string[];
  strokeWidth?: number;
}

export const Graph = ({ data, radius, colors, strokeWidth = 8 }: Props) => {
  const x = scaleLinear()
    .domain([0, 100])
    .range([-Math.PI / 2, Math.PI / 2]);
  return (
    <>
      <svg width={radius * 2} height={radius}>
        <g transform={`translate(${radius},${radius})`}>
          {data.map((d, i) => {
            return (
              <g key={i}>
                <path
                  d={
                    arc()({
                      innerRadius:
                        radius - i * 2 * strokeWidth - strokeWidth / 2,
                      outerRadius:
                        radius - i * 2 * strokeWidth - strokeWidth / 2 + 1,
                      startAngle: x(0),
                      endAngle: x(100),
                    }) as string
                  }
                  fill='none'
                  stroke='#d6d6d6'
                  strokeWidth={strokeWidth}
                  strokeLinejoin='round'
                />
                <path
                  d={
                    arc()({
                      innerRadius:
                        radius - i * 2 * strokeWidth - strokeWidth / 2,
                      outerRadius:
                        radius - i * 2 * strokeWidth - strokeWidth / 2 + 1,
                      startAngle: x(0),
                      endAngle: x(d) as number,
                    }) as string
                  }
                  fill='none'
                  stroke={colors[i % colors.length]}
                  strokeWidth={strokeWidth}
                  strokeLinejoin='round'
                />
              </g>
            );
          })}
        </g>
      </svg>
    </>
  );
};
