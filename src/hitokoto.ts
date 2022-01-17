import axios from "axios";
import { Context, Schema, template } from "koishi";

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
   * https://github.com/AwesomeHamster/koishi-plugin-hitokoto/blob/master/src/template.ts
   */
  template?: template.Node;
}

export const Config = Schema.object({
  apiUrl: Schema.string().description("获取一言的API地址").default("https://v1.hitokoto.cn"),
  timeout: Schema.number().description("请求API时的超时时间").default(3000),
  minLength: Schema.number().description("一言的最小长度"),
  maxLength: Schema.number().description("一言的最大长度"),
  defaultTypes: Schema.array(Schema.string()).description("默认一言类别"),
  template: Schema.dict(Schema.string()).description("回复文本模板"),
});

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

export async function apply(ctx: Context, _config: HitokotoOptions = {}): Promise<void> {
  const config = {
    apiUrl: "https://v1.hitokoto.cn/",
    timeout: 3000,
    ..._config,
  };

  template.set("hitokoto", hitokotoTemplates);
  if (config.template) {
    template.set("hitokoto", config.template);
  }

  ctx
    .command("hitokoto", template("hitokoto.description"))
    .alias("一言")
    .option(
      "type",
      `-t <type:string> ${template("hitokoto.option.type")}`,
    )
    .option("min-length", `-l <length:int> ${template("hitokoto.option.min_length")}`)
    .option("max-length", `-L <length:int> ${template("hitokoto.option.max_length")}`)
    .before(async ({ options }) => {
      if (typeof options?.type !== "undefined") {
        if (!options.type) {
          return template("hitokoto.option.invalid_type");
        }
        const types = options.type.split(",");
        if (types.length <= 0) {
          return template("hitokoto.option.invalid_type");
        } else {
          for (const type of types) {
            if (!type) {
              return template("hitokoto.option.invalid_type");
            }
          }
        }
      }
      if (options?.["min-length"] && options?.["max-length"]) {
        if (options["min-length"] > options["max-length"]) {
          return template("hitokoto.option.min_length_gt_max_length");
        }
      }
    })
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
