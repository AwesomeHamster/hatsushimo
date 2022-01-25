import { Container } from "inversify";
import { EorzeaItemTypes } from "../command/eorzeaItem/eorzeaItemTypes";
import { KoishiEorzeaItemSerivce } from "../command/eorzeaItem/koishi/koishiEorzeaItemService";
import { EorzeaItemService } from "../command/eorzeaItem/service/eorzeaItemService";
import { EorzeaTimeTypes } from "../command/eorzeaTime/eorzeaTimeTypes";
import { KoishiEorzeaTimeSerivce } from "../command/eorzeaTime/koishi/koishEorzeaTimeService";
import { EorzeaTimeService } from "../command/eorzeaTime/service/eorzeaTimeService";

export { eorzeaContainer };

const eorzeaContainer = new Container();
eorzeaContainer.bind<EorzeaTimeService>(EorzeaTimeTypes.EorzeaTimeInterface).to(EorzeaTimeService);
eorzeaContainer.bind<KoishiEorzeaTimeSerivce>(EorzeaTimeTypes.KoishiEorzeaTimeInterface).to(KoishiEorzeaTimeSerivce);
eorzeaContainer.bind<EorzeaItemService>(EorzeaItemTypes.EorzeaItemInterface).to(EorzeaItemService);
eorzeaContainer.bind<KoishiEorzeaItemSerivce>(EorzeaItemTypes.KoishiEorzeaItemInterface).to(KoishiEorzeaItemSerivce);
