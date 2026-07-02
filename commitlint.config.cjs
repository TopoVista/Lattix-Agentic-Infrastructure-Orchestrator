module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "docs", "test", "refactor", "perf", "build", "ci", "chore", "security"]
    ],
    "scope-case": [2, "always", "kebab-case"],
    "subject-case": [0]
  }
};
