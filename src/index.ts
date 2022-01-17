import { Context, template } from "koishi";

import { MacroDictConfig } from "./config";
import { renderMacroView } from "./render";
import macrodictTemplates from "./template";
import { updateMacros } from "./update";

declare module "koishi" {
  interface Tables {
    macrodict: MacroDictDatabase;
  }
}

const locales = ["en", "de", "fr", "ja", "ko", "chs"] as const;

export type LocalizedKeys<T extends string> = `${T}_${typeof locales[number]}`;

export type MacroDictDatabase =
& Record<LocalizedKeys<"Command" | "Alias" | "ShortCommand" | "ShortAlias" | "Description">, string>
& {
  id: number;
  lastUpdated: number;
};

export const name = "macrodict";

// only allow when database available
export const using = ["database"];

export async function apply(ctx: Context, _config: MacroDictConfig): Promise<void> {
  // set database
  ctx.model.extend("macrodict", {
    id: "unsigned",
    lastUpdated: "integer",
    ...localizedKeys("Command", "string"),
    ...localizedKeys("ShortCommand", "string"),
    ...localizedKeys("Alias", "string"),
    ...localizedKeys("ShortAlias", "string"),
    ...localizedKeys("Description", "string"),
  }, {
    primary: "id",
  });

  const config = {
    aliases: [],
    axiosConfig: {},
    ..._config,
  };

  template.set("macrodict", macrodictTemplates);
  if (config.template) {
    template.set("macrodict", config.template);
  }

  ctx
    .command("macrodict <macro>", template("macrodict.description"))
    .alias(...config.aliases)
    .usage("macrodict <macro>")
    .option("lang", "-l <language:string>")
    .action(async ({ options }, macro) => {
      const lang = options?.lang as typeof locales[number] ?? "chs";
      if (!lang || !locales.includes(lang)) {
        return template("macrodict.wrong_language", locales.join(", "));
      }
      macro = macro.startsWith("/") ? macro : "/" + macro;
      const db = await ctx.database.get("macrodict", {
        $or: [
          { [`Command_${lang}`]: { $eq: macro } },
          { [`ShortCommand_${lang}`]: { $eq: macro } },
          { [`Alias_${lang}`]: { $eq: macro } },
          { [`ShortAlias_${lang}`]: { $eq: macro } },
          { Command_en: { $eq: macro } },
          { ShortCommand_en: { $eq: macro } },
          { Alias_en: { $eq: macro } },
          { ShortAlias_en: { $eq: macro } },
        ],
      }, [`Command_${lang}`, `Description_${lang}`, "id"]);

      const puppeteer = ctx.puppeteer;

      if (!puppeteer) {
        return template("macrodict.not_found_puppeteer");
      }

      if (!db || !db[0]) {
        return template("macrodict.not_found_macro", macro);
      }

      return renderMacroView(puppeteer, {
        name: db[0][`Command_${lang}`],
        description: db[0][`Description_${lang}`]});
    });

  if (config.fetchOnStart) {
    // update macro database when bot connected successfully.
    ctx.on("ready", () => updateMacros(ctx));
  }

  ctx
    .command("macrodict.update", template("macrodict.update_description"))
    .action(({ session }) => {
      session?.sendQueued(template("macrodict.start_updating_macros"));
      updateMacros(ctx);
    });
}

export function localizedKeys<T extends string, V>(key: T, value: V): Record<LocalizedKeys<T>, V> {
  return Object.fromEntries(
    locales.map((loc) => [`${key}_${loc}`, value]),
  ) as Record<LocalizedKeys<T>, V>;
}
