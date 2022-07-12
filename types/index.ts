export * from './alchemy';
export * from './balanceData';
export * from './blogs';
export * from './seaport';
export * from './tabs';

export type Social = {
  source: string,
  icon: any,
  number: string,
  subtitle: string,
  action: string,
  destination: string
};

export type TickerStat = {
  stat: {
    value: string;
    sub: string;
  }
};