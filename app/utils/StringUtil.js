const JK_REGEX = new RegExp(/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f]/);

exports.isJKString = function (str) {
  return JK_REGEX.test(str);
};

exports.encode = function (value) {
  return value.replace("\n", "<br />", "g");
};
