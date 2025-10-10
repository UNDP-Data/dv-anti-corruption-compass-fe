import { useEffect, useRef, useState } from 'react';

import { Graph } from './Graph';

import { CountryDataType } from '@/Types';

interface Props {
  data: CountryDataType[];
  innerRadiusRatio?: number;
}

export const PolarBarChart = ({ data, innerRadiusRatio = 0.6 }: Props) => {
  const [radius, setRadius] = useState(0);
  const marginSide = 100;
  const marginTop = 100;
  const graphDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      setRadius((entries[0].target.clientWidth || 620) / 2);
    });
    if (graphDiv.current) {
      setRadius((graphDiv.current.clientWidth || 620) / 2);
      resizeObserver.observe(graphDiv.current);
    }
    return () => resizeObserver.disconnect();
  }, []);
  return (
    <div
      className='bg-transparent w-full max-w-[1024px] mx-auto'
      ref={graphDiv}
    >
      {radius > 0 && (
        <Graph
          data={data}
          radius={radius - marginSide}
          innerRadiusRatio={innerRadiusRatio}
          marginSide={marginSide}
          marginTop={marginTop}
        />
      )}
    </div>
  );
};
