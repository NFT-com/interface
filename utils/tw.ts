import { joinClasses } from 'utils/helpers';

export function tw(...args: string[]) {
  return joinClasses(...args);
}