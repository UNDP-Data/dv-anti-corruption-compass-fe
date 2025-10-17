import { scaleBand, scaleLinear } from 'd3-scale';
import { arc } from 'd3-shape';
import { P } from '@undp/design-system-react/Typography';

import { CountryDataType } from '@/Types';
import { MAIN_INDICATORS_COLORS } from '@/Constants';

interface Props {
  data: CountryDataType[];
  radius: number;
  innerRadiusRatio: number;
  marginSide: number;
  marginTop: number;
}

export const Graph = ({
  data,
  radius,
  innerRadiusRatio,
  marginSide,
  marginTop,
}: Props) => {
  const x = scaleBand()
    .domain(data.map(d => d.subIndicator))
    .range([-Math.PI / 2, Math.PI / 2]);
  const r = scaleLinear()
    .domain([0, 100])
    .range([0, radius * (1 - innerRadiusRatio)]);
  return (
    <svg width={(radius + marginSide) * 2} height={radius + marginTop}>
      <g transform={`translate(${radius + marginSide},${radius + marginTop})`}>
        <path
          d={
            arc()({
              innerRadius: radius * innerRadiusRatio,
              outerRadius: radius,
              startAngle: -Math.PI / 2,
              endAngle: Math.PI / 2,
            }) as string
          }
          fill='#fff'
        />
        {data.map((d, i) => {
          const startAngle = x(d.subIndicator)!;
          const endAngle = startAngle + (x.bandwidth() as number);
          const angle = (startAngle + endAngle) / 2;

          const innerR = radius * innerRadiusRatio;
          const outerR = radius;
          const gradId = `grad-seg-${i}`;

          // get main indicator gradient colors
          const main = MAIN_INDICATORS_COLORS.find(
            m => m.id === d.mainIndicator,
          );

          // helper: polar → cartesian
          const polar = (r: number, a: number) => ({
            x: r * Math.sin(a),
            y: -r * Math.cos(a),
          });

          const pInner = polar(innerR, angle);
          const pOuter = polar(outerR, angle);

          return (
            <g key={i}>
              {/* radial gradient */}
              <defs>
                <linearGradient
                  id={gradId}
                  gradientUnits='userSpaceOnUse'
                  x1={pInner.x}
                  y1={pInner.y}
                  x2={pOuter.x}
                  y2={pOuter.y}
                >
                  <stop
                    offset='0%'
                    stopColor={main?.gradient?.[0] || main?.colors || '#ccc'}
                  />
                  <stop
                    offset='100%'
                    stopColor={main?.gradient?.[1] || main?.colors || '#ccc'}
                  />
                </linearGradient>
              </defs>

              {/* background segment */}
              <path
                d={
                  arc()({
                    innerRadius: innerR,
                    outerRadius: outerR,
                    startAngle,
                    endAngle,
                  }) as string
                }
                fill='#F3F4F6'
                strokeWidth={2}
                stroke='#fff'
              />

              {/* data segment with radial gradient */}
              <path
                d={
                  arc()({
                    innerRadius: innerR,
                    outerRadius: innerR + r(d.value),
                    startAngle,
                    endAngle,
                  }) as string
                }
                fill={`url(#${gradId})`}
                strokeWidth={2}
                stroke='#fff'
              />

              {/* tick */}
              <line
                x1={(radius + 5) * Math.sin(angle)}
                y1={(radius + 5) * Math.cos(angle) * -1}
                x2={(radius + 15) * Math.sin(angle)}
                y2={(radius + 15) * Math.cos(angle) * -1}
                strokeWidth={1}
                fill='none'
                stroke='#F7F7F7'
              />

              {/* label */}
              <foreignObject
                y={(radius + 15) * Math.cos(angle) * -1 - 70}
                x={
                  (radius + 15) * Math.sin(angle) -
                  (Math.abs(angle) > Math.PI / 6
                    ? angle > Math.PI / 6
                      ? 30
                      : 110
                    : 65)
                }
                width={130}
                height={60}
                style={{ overflow: 'visible' }}
              >
                <div className='w-full h-full flex items-center flex-col justify-end'>
                  <P
                    className='poppins-bold !text-[14px] !leading-[130%] text-primary-white text-center'
                    marginBottom='none'
                  >
                    {d.subIndicator}
                  </P>
                  <P
                    className='poppins-light !text-[12px] !leading-[160%] text-primary-white'
                    marginBottom='none'
                  >
                    {d.level}
                  </P>
                </div>
              </foreignObject>
            </g>
          );
        })}
      </g>
    </svg>
  );
};
