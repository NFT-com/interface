import LoggedInIdenticon from './LoggedInIdenticon';

import { AvatarComponent } from '@rainbow-me/rainbowkit';

export const CustomAvatar: AvatarComponent = ({
  address,
}) => {
  console.log(address);
  return <LoggedInIdenticon />;
};

export default CustomAvatar;
