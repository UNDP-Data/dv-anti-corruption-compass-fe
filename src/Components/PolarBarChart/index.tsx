import { useEffect, useRef, useState } from 'react';

import { Graph } from './Graph';

import { DataType, PillarsMetaDataType } from '@/Types';

interface Props {
  data: DataType[];
  innerRadiusRatio?: number;
  pillarsMetaData: PillarsMetaDataType[];
}

export const PolarBarChart = ({
  data,
  innerRadiusRatio = 0.6,
  pillarsMetaData,
}: Props) => {
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
    <div className='bg-transparent container-sm' ref={graphDiv}>
      {radius > 0 && (
        <Graph
          data={data}
          radius={radius - marginSide}
          innerRadiusRatio={innerRadiusRatio}
          marginSide={marginSide}
          marginTop={marginTop}
          pillarsMetaData={pillarsMetaData}
        />
      )}
    </div>
  );
};
