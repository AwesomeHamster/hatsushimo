# `koishi-plugin-ffxiv-macrodict`

A [koishi](https://github.com/koishijs/koishi) plugin for searching macro descriptions which is used in the famous video game [FFXIV (Final Fantasy XIV)](https://www.finalfantasyxiv.com/)

[koishi](https://github.com/koishijs/koishi) 的插件，用于搜索著名的MMORPG网络游戏 [FFXIV (Final Fantasy XIV)](https://www.finalfantasyxiv.com/) 的宏描述文本信息。

## Usage 用法

First, you should install the plugin via `npm` or `yarn`:

首先，你需要通过`npm`或`yarn`安装插件：

```bash
$ npm install --save koishi-plugin-ffxiv-macrodict
$ yarn add koishi-plugin-ffxiv-macrodict
```

Then, you should follow the instructions from [Plugins](https://koishi.js.org/guide/introduction/plugin.html) to add the plugin to your Bot.

然后，你需要根据[认识插件](https://koishi.js.org/guide/introduction/plugin.html)的说明添加此插件到你的机器人中。

## Note 注意

To use this plugin, you need to install the `koishi-plugin-puppeteer` plugin first.

使用本插件前，你需要先安装 `koishi-plugin-puppeteer` 插件。

The plugin will automatically fetch data from [xivapi.com](https://xivapi.com/) for international ragion, [cafemaker](https://cafemaker.wakingsands.com/) for Chinese ragion and [Ra-Workspace/ffxiv-datamining-ko](https://github.com/Ra-Workspace/ffxiv-datamining-ko) for Korean ragion, and cache it locally in the database (currently only MongoDB supported, sorry!).

本插件会自动从 [xivapi.com](https://xivapi.com/) 获取国际服数据，从 [cafemaker](https://cafemaker.wakingsands.com/) 获取中文服数据，从 [Ra-Workspace/ffxiv-datamining-ko](https://github.com/Ra-Workspace/ffxiv-datamining-ko) 获取韩服数据，并缓存到本地数据库中（目前仅支持MongoDB，抱歉！）。

## Configuration 配置

This plugin expose the following configuration:

该插件公开以下配置：

```typescript
export interface MacroDictConfig {
  aliases?: string[];
  template?: template.Node;
  axiosConfig?: AxiosRequestConfig;
}
```

## LICENSE 许可证

This plugin is licensed under the [MIT license](LICENSE).

本插件遵循 [MIT license](LICENSE) 许可协议。

FINAL FANTASY is a registered trademark of Square Enix Holdings Co., Ltd. All the macro data from FINAL FANTASY XIV is used under the [CC-BY-NC-SA 4.0 license](https://creativecommons.org/licenses/by-nc-sa/4.0/).

FINAL FANTASY 是 Square Enix Holdings Co., Ltd. 的注册商标。所有来自 FINAL FANTASY XIV 的宏描述数据均遵循 [CC-BY-NC-SA 4.0 license](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可协议。
