import { tw } from 'utils/tw';

// interface SkeletonLoaderProps extends React.HTMLAttributes<HTMLDivElement> {}
type SkeletonLoaderProps = React.HTMLAttributes<HTMLDivElement>

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className,
  ...props
}: SkeletonLoaderProps) => {
  return (
    <div
      className={tw(
        'h-5 w-2/5 animate-pulse rounded-lg bg-slate-100',
        className
      )}
      {...props}
    />
  );
};

export default SkeletonLoader;