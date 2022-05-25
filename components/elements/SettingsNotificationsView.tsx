import { Button, ButtonType } from 'components/elements/Button';
import { CheckBox } from 'components/elements/CheckBox';
import Loader from 'components/elements/Loader';
import { useMyPreferencesQuery } from 'graphql/hooks/useMyPreferencesQuery';
import { useUpdateMeMutation } from 'graphql/hooks/useUpdateMeMutation';
import { tw } from 'utils/tw';

import { useState } from 'react';
import { useThemeColors } from 'styles/theme/useThemeColors';

const NotificationTypes = [
  {
    key: 'bidActivityNotifications',
    title: 'Bid Activity',
    subtitle: 'When someone bids on one of your assets.',
  },
  {
    key: 'priceChangeNotifications',
    title: 'Price Change',
    subtitle: 'When an asset you made an offer on changes in price.',
  },
  {
    key: 'outbidNotifications',
    title: 'Outbid',
    subtitle: 'When a bid you placed is exceeded by another user.',
  },
  {
    key: 'purchaseSuccessNotifications',
    title: 'Successful Purchase',
    subtitle: 'When you successfully buy an asset.',
  },
  {
    key: 'promotionalNotifications',
    title: 'News & Promotions',
    subtitle: 'When we have something exciting to share.',
  },
];

export function SettingsNotificationsView() {
  const { primaryText, secondaryText } = useThemeColors();

  const { myPreferences, mutate: mutateMyPreferences } = useMyPreferencesQuery();
  const { updateMe } = useUpdateMeMutation();

  /**
   * Draft changes to be saved.
   */
  const [preferencesVal, setPreferencesVal] = useState(
    myPreferences ?? {
      bidActivityNotifications: true,
      outbidNotifications: true,
      priceChangeNotifications: true,
      promotionalNotifications: true,
      purchaseSuccessNotifications: true,
    }
  );
  const [loading, setLoading] = useState(false);

  if (myPreferences == null) {
    return <Loader />;
  }

  return (
    <div
      className={tw(
        'flex flex-col w-1/2',
        'rounded-xl ',
        'text-primary-txt dark:text-primary-txt-dk')
      }
    >
      <span className='text-xl mx-5'>NOTIFICATIONS</span>
      <div className="flex flex-col w-full">
        {NotificationTypes.map(type => {
          return (
            <div
              key={type.title}
              className="flex px-5 pb-5 rounded-lg mt-2.5"
            >
              <div className="mr-4 mt-6">
                <CheckBox
                  checked={preferencesVal[type.key] ?? true}
                  onToggle={newVal => {
                    setPreferencesVal({
                      ...preferencesVal,
                      [type.key]: newVal,
                    });
                  }}
                />
              </div>
              <div className="flex flex-col mt-4">
                <span className="text-lg" style={{ color: primaryText }}>
                  {type.title}
                </span>
                <span className="text-base" style={{ color: secondaryText }}>
                  {type.subtitle}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex self-end">
        <Button
          type={ButtonType.PRIMARY}
          onClick={async () => {
            setLoading(true);
            const result = await updateMe({ preferences: preferencesVal });
            if (result) {
              mutateMyPreferences();
            }
            setLoading(false);
          }}
          label="Save"
          loading={loading}
        />
      </div>
    </div>
  );
}
