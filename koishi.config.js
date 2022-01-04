const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { merge } = require("koishi");

function loadYamlFile(filepath) {
  return yaml.load(String(fs.readFileSync(path.resolve(__dirname, filepath))));
}

module.exports = {
  ...merge(loadYamlFile(".env/hatsushimo.common.yml"), loadYamlFile(`.env/hatsushimo.${process.env["NODE_ENV"]}.yml`)),
};
