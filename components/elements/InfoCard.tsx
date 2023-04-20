interface InfoCardProps {
  title: string;
  value: string;
  unit?: string;
}

export const InfoCard = ({ title, value, unit }: InfoCardProps) => {
  return (
    <div className='rounded-xl bg-white py-5 pl-5 dark:bg-primary-txt'>
      <div className='text-base font-bold tracking-normal text-gray-500'>{title}</div>
      <div className='mt-1 text-3xl font-medium dark:text-white'>
        <b>{value} </b>
        <span className='text-lg font-normal'>{unit}</span>
      </div>
    </div>
  );
};
