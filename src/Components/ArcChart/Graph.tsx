import { scaleLinear } from 'd3-scale';
import { arc } from 'd3-shape';

interface Props {
  data: { value: number; id: string }[];
  radius: number;
  colors: { id: string; color: string }[];
  subPillars: { name: string; id: string }[];
  strokeWidth?: number;
  maxValue?: number;
}

export const Graph = ({
  data,
  radius,
  colors,
  subPillars,
  strokeWidth = 8,
  maxValue = 1,
}: Props) => {
  const x = scaleLinear()
    .domain([0, maxValue])
    .range([-Math.PI / 2, Math.PI / 2]);
  return (
    <>
      <svg width={radius * 2} height={radius}>
        <g transform={`translate(${radius},${radius})`}>
          {subPillars.map((d, i) => {
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
                      endAngle: x(maxValue),
                    }) as string
                  }
                  fill='none'
                  stroke='#d6d6d6'
                  strokeWidth={strokeWidth}
                  strokeLinejoin='round'
                />
                {data.find(el => el.id === d.id)?.value !== null &&
                  data.find(el => el.id === d.id)?.value !== undefined && (
                    <path
                      d={
                        arc()({
                          innerRadius:
                            radius - i * 2 * strokeWidth - strokeWidth / 2,
                          outerRadius:
                            radius - i * 2 * strokeWidth - strokeWidth / 2 + 1,
                          startAngle: x(0),
                          endAngle: x(
                            data.find(el => el.id === d.id)?.value || 0,
                          ) as number,
                        }) as string
                      }
                      fill='none'
                      stroke={colors.find(c => c.id === d.id)?.color}
                      strokeWidth={strokeWidth}
                      strokeLinejoin='round'
                    />
                  )}
              </g>
            );
          })}
        </g>
      </svg>
    </>
  );
};
