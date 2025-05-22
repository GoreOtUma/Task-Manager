import { debounce } from 'lodash';

export const createDebouncedFunc = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
) => {
  return debounce(func, wait);
};