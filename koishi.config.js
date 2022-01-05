const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

require("dotenv").config();

const isDev = process.env.NODE_ENV === "dev";

function loadYamlFile(filepath) {
  return yaml.load(String(fs.readFileSync(path.resolve(__dirname, filepath))));
}

module.exports = {
  host: "0.0.0.0",
  port: 8080,
  nickname: ["hamster", "仓鼠"],
  prefix: ["/", "."],
  delay: {
    character: 5,
    prompt: 60000,
  },
  plugins: {
    "adapter-discord": {
      selfId: process.env["HATSUSHIMO_DISCORD_SELF_ID"],
      token: process.env["HATSUSHIMO_DISCORD_TOKEN"],
    },

    // database
    ...(() => {
      if (isDev) {
        return {
          "database-memory": {},
        }
      } else {
        return {
          "database-mongo": {
            protocol: "mongodb+srv",
            host: process.env["HATSUSHIMO_MONGO_HOST"] || "localhost",
            username: process.env["HATSUSHIMO_MONGO_USERNAME"] || "root",
            password: process.env["HATSUSHIMO_MONGO_PASSWORD"] || "",
            database: process.env["HATSUSHIMO_MONGO_DATABASE"] || "koishiv4",
          },
        }
      }
    })(),

    "common": {},
    "puppeteer": {},

    "hitokoto": {
      template: {
        format: "「{{hitokoto}}」\n\t\t\t\t——{{from_who}}《{{from}}》\n\nPowered by: https://hitokoto.cn",
      },
    },
    "ffxiv-macrodict": {
      aliases: ["?", "宏学词典", "macro", "macros", "宏"],
    },
  },
};
