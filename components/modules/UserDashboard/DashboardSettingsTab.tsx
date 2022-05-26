import { SettingsDetailsView } from 'components/elements/SettingsDetailsView';
import { SettingsNotificationsView } from 'components/elements/SettingsNotificationsView';

import { DashboardTabTitle } from './DashboardTabTitle';

export function DashboardSettingsTab() {
  return (
    <div className="h-full w-full flex flex-col overflow-scroll">
      <DashboardTabTitle title="Settings" />
      <SettingsDetailsView omitImageSection />
      <SettingsNotificationsView />
    </div>
  );
}