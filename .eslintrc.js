module.exports = {
  extends: [
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended",
    // "plugin:storybook/recommended",
  ],
  rules: {
    "prettier/prettier": [
      "error",
      {
        // singleQuote: true,
        // 单引号
        // parser: "flow",
      },
    ],
    "max-len": [
      "error",
      {
        ignoreComments: true,
        code: 140,
      },
    ],
    // 校验除去注释之外的
    // "no-console": [
    //   "error",
    //   {
    //     allow: ["warn", "error"],
    //   },
    // ],
    // 禁用console
    "no-cond-assign": ["error", "always"],
    // if 中禁用赋值操作
    // 'no-debugger': 'error', // 禁用 debugger
    "accessor-pairs": "error",
    // 对象方法 get \ set 必须成对出现, 似乎无效？
    "guard-for-in": "error", // 约束 for in
  },
};
