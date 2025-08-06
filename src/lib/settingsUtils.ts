import { jalaliToGregorian } from './dateFormat';
import { formatTime } from './formatTime';

interface Property {
  value: any;
  checked: boolean;
}

interface Input {
  [key: string]: Property;
}

export function convertObject(input: Input, fieldsConfig: any): { [key: string]: any } {
  const result: { [key: string]: any } = {};

  for (const [key, { value, checked }] of Object.entries(input)) {
    const fieldConfig = fieldsConfig.find((field: any) => field.name === key);

    if (fieldConfig && fieldConfig.disabled) {
      continue;
    }

    if (key === 'timeToComplete' && checked) {
      result[key] = formatTime(value);
    } else if (key === 'expireDate' && checked) {
      result[key] = jalaliToGregorian(value);
    } else {
      result[key] = checked ? value : null;
    }
  }

  return result;
}
