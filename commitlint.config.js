module.exports = {
  extends: ["@commitlint/config-conventional"],
  // 以下时我们自定义的规则
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor", // 重构（即不是新增功能，也不是修改bug的代码变动）
        "test",
        "chore", // 构建过程或辅助工具的变动
        "revert", // feat(pencil): add ‘graphiteWidth’ option (撤销之前的commit)
      ],
    ]
  }
};
