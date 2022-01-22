import { injectable, inject } from "inversify";
import "reflect-metadata";


interface EorzeaTimeInterface {

  getEorzeaTimeWithLocalTime():string;

  toEorzeaTime(localDate: Date):Date;

  toLocalTime(eorzeaDate: Date):Date;
}


@injectable()
export class EorzeaTimeService implements EorzeaTimeInterface{

  getEorzeaTimeWithLocalTime() {
    let et = this.toEorzeaTime(new Date)
    return et.getUTCHours() + ':' + et.getUTCMinutes() + ':' + et.getUTCSeconds();
  }

  toEorzeaTime(localDate: Date) {
    const EORZEA_MULTIPLIER: number = 3600 / 175;
    // Calculate how many ticks have elapsed since 1/1/1970
    let epochTicks: number = localDate.getTime();
    // Multiply those ticks by the Eorzea multipler (approx 20.5x)
    let eorzeaTicks: number = Math.round(epochTicks * EORZEA_MULTIPLIER);
    return new Date(eorzeaTicks);
  }

  toLocalTime(eorzeaDate: Date) {
    const EORZEA_MULTIPLIER: number = 3600 / 175;
    let epochTicks: number = Math.round((eorzeaDate.getTime()) / EORZEA_MULTIPLIER);
    let localTicks: number = epochTicks + new Date(1970, 1, 1).getTime();
    return new Date(localTicks);
  }

}