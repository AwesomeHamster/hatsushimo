import { template } from "koishi";

export interface MacroDictConfig {
  aliases?: string[];
  template?: template.Node;
  fetchOnStart?: boolean;
}
