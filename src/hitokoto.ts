import axios from "axios";
import { Context, template } from "koishi-core";

import hitokotoTemplates from "./template";

export interface HitokotoOptions {
  /**
   * @default "https://v1.hitokoto.cn"
   */
  apiUrl?: string;
  timeout?: number;
  minLength?: number;
  maxLength?: number;
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
   * https://github.com/AwesomeHamster/koishi-plugin-hitokoto/blob/master/template.ts
   */
  template?: { [key: string]: string };
}

export interface HitokotoRet {
  id: number;
  hitokoto:	string;
  type:	string;
  from:	string;
  from_who:	string | null;
  creator:	string;
  creator_uid: number;
  reviewer:	number;
  uuid:	string;
  commit_from:	string;
  created_at:	string;
  length:	number;
}

export const name = "hitokoto";

export async function apply(ctx: Context, _config?: HitokotoOptions): Promise<void> {
  const config = {
    apiUrl: "https://v1.hitokoto.cn/",
    template: hitokotoTemplates,
    timeout: 3000,
    ..._config,
  };

  template.set("hitokoto", config.template);

  ctx
    .command("hitokoto", template("hitokoto.description"))
    .alias("一言")
    .option(
      "type",
      `-t <type:string> ${template("hitokoto.option.type")}`,
    )
    .option("min-length", `-l <length:int> ${template("hitokoto.option.min_length")}`)
    .option("max-length", `-L <length:int> ${template("hitokoto.option.max_length")}`)
    .action(async ({ options }) => {
      const params = new URLSearchParams();
      if (options?.type || config.defaultTypes) {
        (options?.type?.split(",") || config.defaultTypes || []).forEach((type) => params.append("c", type));
      }
      if (options?.["min-length"] || config.minLength) {
        params.append("min_length", options?.["min-length"] || config.minLength?.toString());
      }
      if (options?.["max-length"] || config.maxLength) {
        params.append("max_length", options?.["max-length"] || config.maxLength?.toString());
      }

      try {
        const resp = await axios.get<HitokotoRet>(config.apiUrl, {
          timeout: config.timeout,
          params,
        });
        if (resp.status !== 200) {
          return template("hitokoto.service_unavailable");
        }
        const { data } = resp;
        return template("hitokoto.format", {
          ...data,
          // the `from_who` field may be null.
          from_who: data.from_who ?? "",
        });
      } catch (error) {
        const err = error as Error;
        if (/ETIMEOUT/.test(err.message)) {
          return template("hitokoto.timeout");
        }
        return template("hitokoto.unknown_error", err);
      }
    });
}
