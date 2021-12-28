export default {
  description: "随机一言",
  option: {
    type: "只返回指定类型的一言，可使用 \",\" 分割不同的类型，" +
      "可选类型请参考 https://developer.hitokoto.cn/sentence/#%E5%8F%A5%E5%AD%90%E7%B1%BB%E5%9E%8B-%E5%8F%82%E6%95%B0",
    min_length: "只返回长度大于指定值的一言",
    max_length: "只返回长度小于指定值的一言",
    invalid_type: "不合法的type类型",
    min_length_gt_max_length: "min-length不能大于max-length",
  },
  // more placeholders can be found on:
  // https://developer.hitokoto.cn/sentence/#%E8%BF%94%E5%9B%9E%E6%A0%BC%E5%BC%8F
  format: "「{{hitokoto}}」\n\t\t\t\t——{{from_who}}《{{from}}》",
  service_unavailable: "当前服务不可用",
  unknown_error: "出现未知错误，请稍后再试。\n{{message}}",
  timeout: "请求超时，请稍后再试",
};
