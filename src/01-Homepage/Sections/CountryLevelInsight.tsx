import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@undp/design-system-react/Tabs';
import { useState } from 'react';

import DataTableWithFilters from '../../Components/DataTable';

import {
  CountryTaxonomyDataType,
  DataType,
  PillarsMetaDataType,
} from '@/Types';
import { CountrySelect } from '@/Components/CountrySelect';

interface Props {
  data: DataType[];
  countryTaxonomy: CountryTaxonomyDataType[];
  pillarsMetaData: PillarsMetaDataType[];
}

const CountryLevelInsight = (props: Props) => {
  const { data, countryTaxonomy, pillarsMetaData } = props;
  const [selectedTab, setSelectedTab] = useState('tab 1');
  return (
    <div
      className={`flex items-start pt-50 w-full px-4 bg-cover bg-center bg-no-repeat ${selectedTab === 'tab 2' ? 'bg-transparent' : "bg-[url('/imgs/sphere.webp')]"} px-34 min-h-[calc(100vh-120px)]`}
    >
      <div className='gap-4.5 flex flex-col w-full text-white mx-auto'>
        <Tabs
          color='blue'
          defaultValue='tab 1'
          onValueChange={d => {
            setSelectedTab(d);
          }}
        >
          <TabsList className='mx-0 pl-0'>
            <TabsTrigger
              value='tab 1'
              className='text-primary-white! normal-case poppins-medium text-[18px] data-[state=active]:border-[#61D4F8] px-1'
            >
              Find a Country
            </TabsTrigger>
            <TabsTrigger
              value='tab 2'
              className='text-primary-white! normal-case poppins-medium text-[18px] data-[state=active]:border-[#61D4F8] px-1'
            >
              See Full List
            </TabsTrigger>
          </TabsList>
          <TabsContent value='tab 1'>
            <CountrySelect
              countryTaxonomy={countryTaxonomy}
              heading='Uncover detailed anti-corruption data for your country'
              description='Choose a country to reveal its complete anti-corruption profile — from key indicators to institutional strategies'
            />
          </TabsContent>
          <TabsContent value='tab 2'>
            <DataTableWithFilters
              data={data}
              pillarsMetaData={pillarsMetaData}
              countryTaxonomy={countryTaxonomy}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CountryLevelInsight;
