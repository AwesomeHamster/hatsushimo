import { injectable } from "inversify";
import "reflect-metadata";
import { Context, template } from "koishi";
import { eorzeaContainer } from "../../../ioc/inversify.config";
import { KoishiBaseInterface } from "../../../base/koshiBase";
import { EorzeaItemTypes } from "../eorzeaItemTypes";
import { EorzeaItemService } from "../service/eorzeaItemService";

interface KoishiEorzeaItemInterface extends KoishiBaseInterface {}

@injectable()
export class KoishiEorzeaItemSerivce implements KoishiEorzeaItemInterface {
  templateName = "eorzeaItem";

  template = {
    description: "艾欧泽亚物品",
  };

  commandName = "eorzea.item";

  alias = ["ei"];

  init(context: Context) {
    template.set(this.templateName, this.template);
    context
      .command(this.commandName, this.description())
      .alias(...this.alias)
      .action(() => {
        return this.action();
      });
  }

  description(): string {
    return template("未实现该方法");
  }

  action(): string {
    return template("未实现该方法");
  }
}
