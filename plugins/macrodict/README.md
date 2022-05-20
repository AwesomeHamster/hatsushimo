# `koishi-plugin-ffxiv-macrodict`

A [koishi](https://github.com/koishijs/koishi) plugin for searching macro descriptions which is used in the famous video game [FFXIV (Final Fantasy XIV)](https://www.finalfantasyxiv.com/)

[koishi](https://github.com/koishijs/koishi) 的插件，用于搜索著名的 MMORPG 网络游戏 [FFXIV (Final Fantasy XIV)](https://www.finalfantasyxiv.com/) 的宏描述文本信息。

## Features 功能

The plugin add two new commands: `macrodict` to search macro descriptions, and `macrodict.update` to update those data.

本插件添加了 `macrodict` 命令用于搜索宏描述文本信息，以及 `macrodict.update` 命令用于更新这些数据。

You can invoke `help` command to see the description and usage of these commands after installing the plugin.

你可以在安装插件后使用 `help` 命令查看这些命令的介绍与使用方法。

## Install 安装

### Market 插件市场

If you create your Bot project via the [Koishi boilerplate](https://github.com/koishijs/boilerplate/generate), you can install the `koishi-plugin-ffxiv-macrodict` plugin from the plugin market.
As the dependency of the plugin, you may need to install [koishi-plugin-puppeteer](https://npmjs.com/package/koishi-plugin-puppeteer) and any database plugin before enable the plugin.

如果你通过 [Koishi 模板项目](https://github.com/koishijs/boilerplate/generate)创建了你的机器人，你可以直接在插件市场安装名为 `koishi-plugin-ffxiv-macrodict` 的插件。你可能还需要安装 [koishi-plugin-puppeteer](https://npmjs.com/package/koishi-plugin-puppeteer) 以及任意一个数据库插件才能启用本插件。

You can follow the instructions from [Install and Configure Plugins](https://koishi.js.org/manual/starter/console.html#%E5%AE%89%E8%A3%85%E5%92%8C%E9%85%8D%E7%BD%AE%E6%8F%92%E4%BB%B6) to add the plugin to your Bot.

你可以需要参考[安装和配置插件](https://koishi.js.org/manual/starter/console.html#%E5%AE%89%E8%A3%85%E5%92%8C%E9%85%8D%E7%BD%AE%E6%8F%92%E4%BB%B6)的说明添加此插件到你的机器人中。

### Manually 手动安装

First, you should have `nodejs` and a package manager like `yarn` or `npm` installed.

首先，你需要安装 `nodejs` 以及任意一个包管理器，如 `yarn` 或 `npm`。

```bash
# We recommend to use `yarn`
# 建议使用 `yarn`
$ yarn add koishi-plugin-ffxiv-macrodict
# But you can use `npm` if you prefer
# 但是你也可以使用 `npm`
$ npm install --save koishi-plugin-ffxiv-macrodict
```

## Note 注意

The plugin will automatically fetch data from [xivapi.com](https://xivapi.com/) for international ragion, [cafemaker](https://cafemaker.wakingsands.com/) for Chinese ragion and [Ra-Workspace/ffxiv-datamining-ko](https://github.com/Ra-Workspace/ffxiv-datamining-ko) for Korean ragion, and cache it in the database.

本插件会自动从 [xivapi.com](https://xivapi.com/) 获取国际服数据，从 [cafemaker](https://cafemaker.wakingsands.com/) 获取中文服数据，从 [Ra-Workspace/ffxiv-datamining-ko](https://github.com/Ra-Workspace/ffxiv-datamining-ko) 获取韩服数据，并缓存到数据库中。

## Configuration 配置

This plugin expose the following configuration:

该插件公开以下配置：

```typescript
export interface MacroDictConfig {
  aliases?: string[]
  defaultLanguage?: 'en' | 'de' | 'fr' | 'ja' | 'ko' | 'chs'
  fetchOnStart?: boolean
}
```

## LICENSE 许可证

This plugin is licensed under the [MIT license](LICENSE).

本插件遵循 [MIT license](LICENSE) 许可协议。

FINAL FANTASY is a registered trademark of Square Enix Holdings Co., Ltd. All the macro data from FINAL FANTASY XIV is used without any modification.

FINAL FANTASY 是 Square Enix Holdings Co., Ltd. 的注册商标。所有来自 FINAL FANTASY XIV 的宏描述数据均未作任何修改。
