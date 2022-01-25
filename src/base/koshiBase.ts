import { Context } from "koishi";

export interface KoishiBaseInterface {
  templateName: string;
  template: any;
  commandName: string;
  alias: string[];
  init(context: Context): void;
  description(): string;
  action(): string;
}
