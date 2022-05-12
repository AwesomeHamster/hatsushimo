import { Context } from 'koishi'

export const name = 'time'

export async function apply(ctx: Context): Promise<void> {
  ctx.command('eorzea.time').action(({ session }) => {
    const time = localTime2EorzeaTime(new Date())

    return session?.text('.eorzea_time_now', [
      session.text('.format', {
        hour: time.getUTCHours(),
        minute: time.getUTCMinutes(),
        second: time.getUTCSeconds(),
      }),
    ])
  })
}

const EORZEA_MULTIPLIER: number = 3600 / 175

export const eorzeaTime2LocalTime = (eorzeaDate: Date): Date => {
  const epochTicks: number = Math.round(
    eorzeaDate.getTime() / EORZEA_MULTIPLIER,
  )
  const localTicks: number = epochTicks + new Date(1970, 1, 1).getTime()
  return new Date(localTicks)
}

export const localTime2EorzeaTime = (localDate: Date): Date => {
  // Calculate how many ticks have elapsed since 1/1/1970
  const epochTicks: number = localDate.getTime()
  // Multiply those ticks by the Eorzea multipler (approx 20.5x)
  const eorzeaTicks: number = Math.round(epochTicks * EORZEA_MULTIPLIER)
  return new Date(eorzeaTicks)
}
