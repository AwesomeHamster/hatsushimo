# koishi-plugin-hitokoto

A simple plugin for [koishi](https://github.com/koishijs/koishi) the bot framework to get a random Hitokoto sentence, which is from [一言网](https://hitokoto.cn).

BOT 框架 [koishi](https://github.com/koishijs/koishi) 的插件，调用指令后会回复随机的一句话。该服务由 [一言网](https://hitokoto.cn) 提供。

## How to Install 安装方式

Plugins in koishi can be installed either by Plugin Market or Package Managers.

该插件可以通过插件市场安装，也可以通过包管理器安装。

### Plugin Market 插件市场安装

If you have a fully functional environment with koishi and the market plugin, you can install this plugin by easily search for the name: `koishi-plugin-hitokoto`.

如果你已经有一个完整可运行的 koishi 环境，并且添加了插件市场插件，那么你可以直接在插件市场中搜索本插件的名称进行安装：`koishi-plugin-hitokoto`。

### Manually 手动安装

If you want to install this plugin manually, you should make sure you have `npm` or `yarn` installed, then run the command below:

如果你想要手动安装本插件，你应该确保你的系统已经安装了 `npm` 或者 `yarn`，然后运行下面的命令：

```bash
# If you have npm installed 如果你使用的是 npm
$ npm install --save koishi-plugin-hitokoto
# If you have yarn installed 如果你使用的是 yarn
$ yarn add koishi-plugin-hitokoto
```

When it is installed by your package manager, you should also add the plugin name into your koishi configuration file.

当你使用包管理器安装完毕后，还需要将此插件的名称填入你的 koishi 配置文件。

Let's assume you have a configuration file that is YAML format, you should add an entry like this:

我们假设你的配置文件是 YAML 格式，你需要像下面这样添加一个配置项：

```yaml
---
# ...
plugins:
  hitokoto:
    # Add configurations as you need
    # 添加你需要的配置，具体见下面的配置项介绍
    apiUrl: https://api.hitokoto.cn/
    minLength: 0
    maxLength: 30
```

## Configuration 配置

You can configure this plugin using the following configurations.

该插件有以下配置项可以配置：

|   Name 名字    |    Type 类型    | Required 是否必选 |       Default 默认值       |                                                                                                       Description 描述                                                                                                        |
| :------------: | :-------------: | :---------------: | :------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|    `apiUrl`    |    `string`     |       no 否       | `https://api.hitokoto.cn/` |                                                                                           The API URL of the service. 一言服务地址                                                                                            |
|  `minLength`   |    `number`     |       no 否       |             0              |                                                           The minimum length of the sentence, can be override via options. 句子最小长度，可在调用指令时用选项覆盖。                                                           |
|  `maxLength`   |    `number`     |       no 否       |             30             |                                                           The maximum length of the sentence, can be override via options. 句子最大长度，可在调用指令时用选项覆盖。                                                           |
| `defaultTypes` | `Array<string>` |       no 否       |     all types 所有类型     | The default types of the sentence, can be override via options. If an empty array was passed in, then the plugin would treat it as `['a']`. 默认句子类型，可在调用指令时用选项覆盖。若传入的是空字符串，则当作 `['a']` 类型。 |

## Translation

This plugin supports multiple languages.

To contribute translations, please register a [Crowdin](https://crowdin.com/) and contribute translations to the `hitokoto` folder of the project [hatsushimo](https://crowdin.com/project/hatsushimo).

## ChangeLog 修订日志

The change log of this plugin can be found [here](./CHANGELOG.md).

你可以在[这里](./CHANGELOG.md)查看本插件的修订日志。

## License 许可证

This project is licensed under the MIT license, and the use of data from [一言网](https://hitokoto.cn) is in non-commercial purposes.

该项目遵循 MIT 协议，且以非商业形式引用[一言网](https://hitokoto.cn)的数据。
