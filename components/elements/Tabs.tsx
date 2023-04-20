import { ReactNode, useCallback } from 'react';
import { Tab } from '@headlessui/react';

import { useTabs } from 'hooks/utils';
import { tw } from 'utils/tw';

type TabType = {
  label: string;
  content?: ReactNode;
  labelChild?: ReactNode;
};

type TabsProps = {
  tabOptions: TabType[];
  defaultTab?: number;
  onTabChange?: (selectedTab: string) => void;
  // set tab width classes
  customTabWidth?: string;
};

export function Tabs({ tabOptions, defaultTab, onTabChange, customTabWidth }: TabsProps) {
  const [selectedTab, setSelectedTab] = useTabs(
    defaultTab ?? 0,
    tabOptions.reduce((obj, string, index) => ((obj[index] = string), obj), {})
  );

  const handleTabChange = useCallback(
    (index: number) => {
      setSelectedTab(index);
      if (onTabChange) {
        onTabChange(tabOptions[index]?.label);
      }
    },
    [onTabChange, setSelectedTab, tabOptions]
  );

  return (
    <Tab.Group>
      <Tab.List className={tw('flex space-x-2 rounded-3xl bg-[#F6F6F6]', customTabWidth ?? 'w-full')}>
        {tabOptions.map((tab, index) => (
          <Tab
            key={`tab-${index}`}
            className={tw(
              'w-full',
              'flex justify-center rounded-3xl px-8 py-2.5 font-noi-grotesk text-[16px] font-medium leading-5 text-[#6F6F6F] md:px-5',
              selectedTab === index && 'bg-black text-[#F8F8F8]'
            )}
            onClick={() => handleTabChange(index)}
          >
            {tab.label}
            {tab?.labelChild}
          </Tab>
        ))}
      </Tab.List>
      {tabOptions.map((tab, index) => (
        <Tab.Panel key={index} className='py-4'>
          {selectedTab === index && tab.content}
        </Tab.Panel>
      ))}
    </Tab.Group>
  );
}
