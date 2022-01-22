import { eorzeaContainer } from "./ioc/inversify.config";
import { Context,template } from "koishi";
import { EorzeaTimeTypes } from "./command/eorzeaTime/eorzeaTimeTypes";
import { KoishiEorzeaTimeSerivce } from "./command/eorzeaTime/koishi/koishEorzeaTimeService";
import { EorzeaItemTypes } from "./command/eorzeaItem/eorzeaItemTypes";
import { KoishiEorzeaItemSerivce } from "./command/eorzeaItem/koishi/koishiEorzeaItemService";


export const name = "eorzea";

export interface EorzeaOptions {

  defaultTypes?: string[];
  template?: template.Node;

}

export async function apply(context: Context, _config: EorzeaOptions = {}): Promise<void> {
    let koishiEorzeaTimeInterface = eorzeaContainer.get<KoishiEorzeaTimeSerivce>(EorzeaTimeTypes.KoishiEorzeaTimeInterface);
    let koishiEorzeaItemInterface = eorzeaContainer.get<KoishiEorzeaItemSerivce>(EorzeaItemTypes.KoishiEorzeaItemInterface);
    koishiEorzeaTimeInterface.init(context);
    koishiEorzeaItemInterface.init(context);
}