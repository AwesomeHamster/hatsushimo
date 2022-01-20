
import { Context, Schema, template } from "koishi";

import {ToEorzeaTime} from "./eorzeaDateTime";
import eorzeaTemplates from "./template";

export interface EorzeaOptions {
  /**
   * only reply restricted types of hitokoto sentences
   *
   * Available types can be found on:
   * https://developer.hitokoto.cn/sentence/#%E5%8F%A5%E5%AD%90%E7%B1%BB%E5%9E%8B-%E5%8F%82%E6%95%B0
   */
  defaultTypes?: string[];
  /**
   * For costumizing the hitokoto response format.
   *
   * Available templates can be found on:
   * https://github.com/AwesomeHamster/koishi-plugin-hitokoto/blob/master/src/template.ts
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
        let et = ToEorzeaTime(new Date)
        const data = {
            eorzeaTime:et.getUTCHours() + ':' + et.getUTCMinutes() + ':' + et.getUTCSeconds()
        };
        return template("eorzea.format",data);
    });
}
