import { useEffect, useRef, useState, useEffectEvent } from 'react';
import { Spinner } from '@undp/design-system-react/Spinner';

import { Graph } from './Graph';

import { DataType, IndicatorsMetaDataType } from '@/Types';

interface Props {
  data: DataType[];
  innerRadiusRatio?: number;
  indicatorMetaData: IndicatorsMetaDataType;
  maxValue?: number;
}

export const PolarBarChart = ({
  data,
  innerRadiusRatio = 0.6,
  indicatorMetaData,
  maxValue = 100,
}: Props) => {
  const [radius, setRadius] = useState(0);
  const marginSide = 100;
  const marginTop = 100;
  const graphDiv = useRef<HTMLDivElement>(null);
  const setRadiusEvent = useEffectEvent(() => {
    if (graphDiv.current) {
      setRadius((graphDiv.current.clientWidth || 620) / 2);
    }
  });
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      setRadius((entries[0].target.clientWidth || 620) / 2);
    });
    if (graphDiv.current) {
      setRadiusEvent();
      resizeObserver.observe(graphDiv.current);
    }
    return () => resizeObserver.disconnect();
  }, []);
  return (
    <div className='bg-transparent container-sm' ref={graphDiv}>
      {radius > 0 && (
        <Graph
          data={data}
          radius={radius - marginSide}
          innerRadiusRatio={innerRadiusRatio}
          marginSide={marginSide}
          marginTop={marginTop}
          indicatorMetaData={indicatorMetaData}
          maxValue={maxValue}
        />
      )}
      {radius === 0 && <Spinner size='lg' className='my-20 m-auto' />}
    </div>
  );
};
