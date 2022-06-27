/* eslint-disable @next/next/no-img-element */
import { LoadingCard } from './LoadingRow';

interface ProfileFeedProps {
  profiles: string[];
}

export const ProfileFeed = (props: ProfileFeedProps) => {
  return (
    <div className="mb-4 grid gap-x-4 gap-y-5 deprecated_minmd:gap-6 deprecated_minmd:grid-cols-4 grid-cols-2 content-start">
      {props.profiles.map(num => <LoadingCard key={num} />)}
    </div>
  );
};