import { scaleBand, scaleLinear } from 'd3-scale';
import { arc } from 'd3-shape';
import { P } from '@undp/design-system-react/Typography';

import { CountryDataType } from '@/Types';
import { SUB_PILLARS } from '@/Constants';

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
    .range([-Math.PI / 2, Math.PI / 2])
    .paddingInner(0.1);
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
          const angle = x(d.subIndicator)! + (x.bandwidth() as number) / 2;
          return (
            <g key={i}>
              <line
                x1={(radius + 5) * Math.sin(angle)}
                y1={(radius + 5) * Math.cos(angle) * -1}
                x2={(radius + 15) * Math.sin(angle)}
                y2={(radius + 15) * Math.cos(angle) * -1}
                strokeWidth={1}
                fill='none'
                stroke='#fff'
              />
              <foreignObject
                y={(radius + 15) * Math.cos(angle) * -1 - 60}
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
                    className='poppins-bold !text-[14px] !leading-[140%] text-primary-white text-center'
                    marginBottom='none'
                  >
                    {d.subIndicator}
                  </P>
                  <P
                    className='poppins-regular !text-[14px] !leading-[140%] text-primary-white'
                    marginBottom='none'
                  >
                    {d.level}
                  </P>
                </div>
              </foreignObject>
              <path
                d={
                  arc()({
                    innerRadius: radius * innerRadiusRatio,
                    outerRadius: radius * innerRadiusRatio + r(d.value),
                    startAngle: x(d.subIndicator) as number,
                    endAngle: x(d.subIndicator)! + (x.bandwidth() as number),
                  }) as string
                }
                fill={
                  SUB_PILLARS.find(el => el.mainIndicator === d.mainIndicator)
                    ?.mainIndicatorColor
                }
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
};
