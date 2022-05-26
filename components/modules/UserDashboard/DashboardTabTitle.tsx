export interface DashboardTabTitleProps {
  title: string;
}

export function DashboardTabTitle(props: DashboardTabTitleProps) {
  return <span className="text-4xl mt-8 text-primary-txt dark:text-primary-txt-dk deprecated_sm:ml-4">
    {props.title}
  </span>;
}