import { tw } from 'utils/tw';

const checkValueLength = (rules: number) => {
  if (rules <= 0) {
    return 1;
  }else {
    return rules;
  }
};

export const GridSystem = (count?: number, paddingStart?: number, paddingEnd?: number, isFilterOpen?: boolean) => {
  const gridValue = isFilterOpen ? count - 1 : count;
  const gridLine = `minhd:grid-cols-${checkValueLength(gridValue + 2)} minxxl:grid-cols-${checkValueLength(gridValue + 1)} minxl:grid-cols-${checkValueLength(gridValue)} minlg:grid-cols-${checkValueLength(gridValue - 1)} minmd:grid-cols-${checkValueLength(gridValue - 2)} grid-cols-${checkValueLength(gridValue - 3)}`;
  const grid = tw(
    `minmd:grid gap-${paddingStart} minmd:gap-${paddingEnd} minmd:space-x-0 `,
    `${gridLine} w-full`
  );
  return grid;
};
