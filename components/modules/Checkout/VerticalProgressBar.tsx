import { tw } from 'utils/tw';

export type ProgressBarItem = {
  label: string;
  icon?: React.ReactElement;
}

export type ProgressBarNode = {
  label: string;
  error?: boolean;
  items?: ProgressBarItem[]
}

export interface VerticalProgressBarProps {
  nodes: ProgressBarNode[];
  activeNodeIndex: number;
}

export function VerticalProgressBar(props: VerticalProgressBarProps) {
  return <div className="flex flex-col w-full border-l-2 border-black dark:border-white m-4">
    {props.nodes.map((node, index) => {
      return (
        <div
          key={'node' + index}
          className={tw(
            'flex w-full',
            index < props.nodes.length - 1 && 'mb-12'
          )}>
          <div className={tw(
            'h-7 aspect-square shrink-0 rounded-full border-2 border-black dark:border-white -ml-4',
            index < props.activeNodeIndex && 'bg-green-summary',
            index === props.activeNodeIndex && 'bg-yellow-400 motion-safe:animate-bounce',
            index > props.activeNodeIndex && 'bg-gray-300',
            node.error && 'bg-red-400 animate-none motion-safe:animate-none',
          )} />
          <div className='flex flex-col w-full'>
            <div className='font-bold ml-4'>{node.label}</div>
            <div className="ml-4 flex-col">
              {node.items?.map((item, index) => {
                return <div key={index} className='flex items-center mt-4'>
                  {item.icon}
                  <div className='ml-2 line-clamp-1'>{item.label}</div>
                </div>;
              })}
            </div>
          </div>
        </div>
      );
    })}
  </div>;
}