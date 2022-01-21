export const EORZEA_MULTIPLIER: number = 3600 / 175;

export function ToEorzeaTime(date: Date) {
  // Calculate how many ticks have elapsed since 1/1/1970
  let epochTicks: number = date.getTime();

  // Multiply those ticks by the Eorzea multipler (approx 20.5x)
  let eorzeaTicks: number = Math.round(epochTicks * EORZEA_MULTIPLIER);

  return new Date(eorzeaTicks);
}

export function ToLocalTime(eorzeaDate: Date) {
  let epochTicks: number = Math.round(eorzeaDate.getTime() / EORZEA_MULTIPLIER);

  let localTicks: number = epochTicks + new Date(1970, 1, 1).getTime();

  return new Date(localTicks);
}
