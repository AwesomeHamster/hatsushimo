import { Context, template } from "koishi";

import { ToEorzeaTime } from "./eorzeaDateTime";
import eorzeaTemplates from "./template";

export interface EorzeaOptions {
  /**
   * For costumizing the response text format of this plugin.
   *
   * Available templates can be found on:
   * https://github.com/AwesomeHamster/koishi-plugin-ffxiv-eorzea/blob/master/src/template.ts
   */
  template?: template.Node;
}

export const name = "eorzea";

export async function apply(ctx: Context, _config: EorzeaOptions = {}): Promise<void> {
  template.set("eorzea", eorzeaTemplates);
  ctx
    .command("eorzea.time", template("eorzea.description"))
    .alias("et")
    .action(() => {
      let et = ToEorzeaTime(new Date());
      const data = {
        eorzeaTime: et.getUTCHours() + ":" + et.getUTCMinutes() + ":" + et.getUTCSeconds(),
      };
      return template("eorzea.format", data);
    });
}
