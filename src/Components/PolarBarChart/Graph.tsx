import { scaleBand, scaleLinear } from 'd3-scale';
import { arc } from 'd3-shape';
import { P } from '@undp/design-system-react/Typography';

import { CountryDataType, PillarsMetaDataType } from '@/Types';

interface Props {
  data: CountryDataType[];
  radius: number;
  innerRadiusRatio: number;
  marginSide: number;
  marginTop: number;
  pillarsMetaData: PillarsMetaDataType[];
}

export const Graph = ({
  data,
  radius,
  innerRadiusRatio,
  marginSide,
  marginTop,
  pillarsMetaData,
}: Props) => {
  const x = scaleBand()
    .domain(data.map(d => d.subIndicator))
    .range([-Math.PI / 2, Math.PI / 2]);
  const r = scaleLinear()
    .domain([0, 100])
    .range([0, radius * (1 - innerRadiusRatio)]);
  return (
    <>
      <svg width={(radius + marginSide) * 2} height={radius + marginTop}>
        <defs>
          {[...new Set(pillarsMetaData.map(d => d.value))].map((d, i) => (
            <radialGradient
              key={i}
              id={`${d.replaceAll(' ', '-')}-gradient`}
              gradientUnits='userSpaceOnUse'
              r={radius}
              cx={0}
              cy={0}
              fr={radius * innerRadiusRatio}
              fx={0}
              fy={0}
            >
              <stop
                offset='10%'
                stopColor={
                  pillarsMetaData.find(el => el.value === d)?.colors[0]
                }
              />
              <stop
                offset='90%'
                stopColor={
                  pillarsMetaData.find(el => el.value === d)?.colors[1]
                }
              />
            </radialGradient>
          ))}
        </defs>
        <g
          transform={`translate(${radius + marginSide},${radius + marginTop})`}
        >
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

            return (
              <g key={i}>
                <path
                  d={
                    arc()({
                      innerRadius: radius * innerRadiusRatio,
                      outerRadius: radius,
                      startAngle: x(d.subIndicator) as number,
                      endAngle: x(d.subIndicator)! + (x.bandwidth() as number),
                    }) as string
                  }
                  fill='#F3F4F6'
                  strokeWidth={2}
                  stroke='#fff'
                />
                <line
                  x1={(radius + 5) * Math.sin(angle)}
                  y1={(radius + 5) * Math.cos(angle) * -1}
                  x2={(radius + 15) * Math.sin(angle)}
                  y2={(radius + 15) * Math.cos(angle) * -1}
                  strokeWidth={1}
                  fill='none'
                  stroke='#F7F7F7'
                />
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
                <path
                  d={
                    arc()({
                      innerRadius: radius * innerRadiusRatio,
                      outerRadius: radius * innerRadiusRatio + r(d.value),
                      startAngle: x(d.subIndicator) as number,
                      endAngle: x(d.subIndicator)! + (x.bandwidth() as number),
                    }) as string
                  }
                  fill={`url(#${d.mainIndicator.replaceAll(' ', '-')}-gradient)`}
                />
              </g>
            );
          })}
        </g>
      </svg>
    </>
  );
};
