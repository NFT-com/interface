import { useTabs } from 'hooks/utils';
import { tw } from 'utils/tw';

import { Tab } from '@headlessui/react';
import { ReactNode } from 'react';

type Tab = {
  label: string;
  content: ReactNode;
};

type TabsProps = {
  tabOptions: Tab[];
  defaultTab?: number;
  onTabChange?: (selectedTab: string) => void;
};

export function Tabs({ tabOptions, defaultTab = 0, onTabChange }: TabsProps) {
  const [selectedTab, setSelectedTab] = useTabs(defaultTab, tabOptions.reduce((obj, string, index) => (obj[index] = string, obj), {}));

  const handleTabChange = (index: number) => {
    setSelectedTab(index);
    if (onTabChange) {
      onTabChange(tabOptions[index]?.label);
    }
  };

  return (
    <Tab.Group>
      <Tab.List className="flex space-x-4 bg-[#F6F6F6] rounded-3xl">
        {tabOptions.map((tab, index) => (
          <Tab
            key={`tab-${index}`}
            className={({ selected }) =>
              tw(
                'w-full rounded-3xl py-2.5 md:px-5 px-8 font-noi-grotesk text-[16px] font-medium leading-5 text-[#6F6F6F]',
                selected && 'bg-black text-[#F8F8F8]'
              )
            }
            onClick={() => handleTabChange(index)}
          >
            {tab.label}
          </Tab>
        ))}
      </Tab.List>
      {tabOptions.map((tab, index) => (
        <Tab.Panel key={index} className="py-4">
          {selectedTab === index && tab.content}
        </Tab.Panel>
      ))}
    </Tab.Group>
  );
}