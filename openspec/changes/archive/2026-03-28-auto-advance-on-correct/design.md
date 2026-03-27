# Design: auto-advance-on-correct

## 上下文

在 `app.js` 的 `submitAnswer()` 函数中，答题流程目前需要用户手动点击"下一题"。用户希望在答对选择题后能自动进入下一题，提升刷题效率。

## 目标 / 非目标

**目标：**
- 练习模式和复习模式下，选择题答对后 300ms 自动进入下一题
- 答错时保持现有行为（停留，手动确认）

**非目标：**
- 简答题（type 3）不适用此行为
- 背诵模式不适用（不是答题逻辑）
- 不改变其他交互逻辑

## 决策

**在 `submitAnswer()` 末尾添加 auto-advance 逻辑**

```javascript
// 如果答对了，300ms 后自动进入下一题
if (isCorrect && !isType3Question(question) && !state.isMemorizeMode) {
    setTimeout(() => nextQuestion(), 300);
}
```

**为什么不是其他方案：**
- 不创建新函数：改动最小，直接在现有函数末尾添加
- 300ms 延迟：足够让用户看清"✓ 正确"反馈，又不会感觉等待过长
- 用 `setTimeout` 而非 `setInterval`：一次性延迟，不污染全局状态

## 风险 / 权衡

- **用户来不及看清选项**：300ms 内用户仍可看到高亮的正确选项
- **快速连续答对可能跳过太快**：如果用户想仔细看解析，auto-advance 会催促他们 —— 但这是预期行为（答错时停留已是保护）
