# `koishi-plugin-hitokoto`

A simple plugin for [koishi](https://github.com/koishijs/koishi) that provides a command `hitokoto` to get a random hitokoto sentence, which is from [https://hitokoto.cn](https://hitokoto.cn).

[koishi](https://github.com/koishijs/koishi)的插件，提供一个`hitokoto`的指令，用于获取随机一言。该服务由[https://hitokoto.cn](https://hitokoto.cn)提供。

## Usage 用法

First, you should install the plugin via `npm` or `yarn`:

首先，你需要通过`npm`或`yarn`安装插件：

```bash
$ npm install --save koishi-plugin-hitokoto
$ yarn add koishi-plugin-hitokoto
```

Then, you should follow the instructions from [Plugins](https://koishi.js.org/guide/introduction/plugin.html) to add the plugin to your Bot.

然后，你需要根据[认识插件](https://koishi.js.org/guide/introduction/plugin.html)的说明添加此插件到你的机器人中。

## Configuration 配置

This plugin expose the following configuration:

该插件公开以下配置：

```typescript
export interface HitokotoOptions {
  /**
   * @default "https://v1.hitokoto.cn"
   */
  apiUrl?: string;
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
```

## License 许可证

This project is licensed under the MIT license.

该项目遵循MIT协议。
