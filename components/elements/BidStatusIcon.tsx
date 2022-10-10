import { ProfileStatus } from 'graphql/generated/types';
import { Doppler, getEnvBool } from 'utils/env';

import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/solid';
import { rgba } from 'polished';
import { useThemeColors } from 'styles/theme/useThemeColors';

export interface BidStatusIconProps {
  status: ProfileStatus | 'Listed';
  isOwner: boolean;
  whiteBackgroundOverride?: boolean;
}

export function BidStatusIcon(props: BidStatusIconProps) {
  const { pink, green: themeAwareGreen } = useThemeColors();
  // TODO (eddie): remove this hack after Genesis Key UI is deprecated
  const green = props.whiteBackgroundOverride ? rgba(16, 185, 129, 1) : themeAwareGreen;
  switch (props.status) {
  case ProfileStatus.Available:
    return (
      <div className="flex item-center">
        {!getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_FACTORY_ENABLED) &&
        <div className="w-full text-center mr-1 text-sm" style={{ color: green }}>
            Available!
        </div>
        }
        <CheckCircleIcon className="h-5 w-5" style={{ color: green }} aria-hidden="true" />
      </div>
    );
  case ProfileStatus.Pending:
    return (
      <div className="flex item-center">
        {!getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_FACTORY_ENABLED) &&
        <div className="w-full text-center mr-1 text-sm" style={{ color: pink }}>
            Pending Claim
        </div>
        }
        <ExclamationCircleIcon className="h-5 w-5" aria-hidden="true" style={{ color: pink }} />
      </div>
    );
  case ProfileStatus.Owned:
    return props.isOwner
      ? (
        <div className="flex item-center">
          {!getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_FACTORY_ENABLED) &&
          <div className="w-full text-center mr-1 text-sm" style={{ color: green }}>
            You are the owner!
          </div>
          }
          <ExclamationCircleIcon className="h-5 w-5" style={{ color: green }} aria-hidden="true" />
        </div>
      )
      : (
        <div className="flex item-center">
          {!getEnvBool(Doppler.NEXT_PUBLIC_PROFILE_FACTORY_ENABLED) &&
          <div className="w-full text-center mr-1 text-sm" style={{ color: pink }}>
            Unavailable
          </div>
          }
          <ExclamationCircleIcon className="h-5 w-5" aria-hidden="true" style={{ color: pink }} />
        </div>
      );

  case ProfileStatus.Listed:
    return props.isOwner
      ? (
        <div className="flex item-center">
          <ExclamationCircleIcon className="h-5 w-5" style={{ color: green }} aria-hidden="true" />
        </div>
      )
      : (
        <div className="flex item-center">
          <CheckCircleIcon className="h-5 w-5" style={{ color: 'EAC232' }} aria-hidden="true" />
        </div>
      );
  default:
    return null;
  }
}
