## 上下文

当前刷题工具使用纯前端架构（HTML/CSS/JavaScript），题目数据从 JSON 文件加载，用户状态保存在 localStorage。练习模式（`startPractice()`）按 JSON 文件原始顺序呈现题目，缺乏打乱顺序的能力。

现有相关功能：
- `practice-mode`: 练习模式核心逻辑
- `question-navigation-panel`: 题目导航面板，显示所有题目状态
- `answered-questions-persistence`: 基于 questionId 的答题状态持久化
- `persistent-answer-storage`: 答案选择的持久化存储

约束：
- 纯客户端实现，无后端
- 不能破坏现有的答题状态追踪和错题记录功能
- 保持简洁的用户体验

## 目标 / 非目标

**目标：**
- 允许用户在进入练习时选择顺序或随机模式
- 随机模式每次进入都重新打乱题目顺序
- 支持保存用户偏好，避免重复选择
- 在练习页面清晰显示当前模式
- 保持现有功能（答题状态、错题追踪、导航面板）的正常工作

**非目标：**
- 在练习中途切换模式（会导致导航混乱）
- 保存随机种子以复现特定随机顺序
- 为复习模式或背题模式添加随机功能
- 显示题目的原始位置编号（随机就是要忘掉位置）

## 决策

### 决策 1: 模态框触发时机

**选择：点击"开始练习"后弹出模态框**

替代方案考虑：
- A. Dashboard 上每个科目卡片添加 checkbox → 占用空间，不够灵活
- B. Dashboard 顶部全局开关 → 缺少每次选择的灵活性
- C. 练习页面内切换按钮 → 切换会导致导航混乱

理由：
- 每次进入都可以根据当前需求选择
- 不占用 Dashboard 空间
- 用户意图明确，不会误触
- 支持"记住选择"后可跳过弹窗

### 决策 2: 随机算法

**选择：Fisher-Yates shuffle 算法**

```javascript
function shuffle(array) {
  const result = [...array]; // 不修改原数组
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
```

理由：
- 标准算法，均匀分布
- O(n) 时间复杂度，性能优秀
- 简单可靠，无需外部依赖

### 决策 3: 用户偏好存储

**选择：localStorage 存储单一偏好值**

存储结构：
```javascript
localStorage.setItem('preferredPracticeMode', 'random' | 'sequential' | null)
```

替代方案考虑：
- 为每个科目分别存储偏好 → 过度复杂，用户很少需要
- 使用 sessionStorage → 关闭浏览器后丢失，体验不佳

理由：
- 简单直接，一个键值对
- 全局生效，符合大多数用户习惯
- 用户可以通过模态框中的 checkbox 控制是否保存

### 决策 4: 模态框 UI 设计

**选择：单选按钮 + 可选的"记住选择" checkbox**

结构：
```
┌────────────────────────────────┐
│ 选择练习模式                   │
│                                │
│ ○ 顺序练习                     │
│   按题目原始顺序依次练习       │
│                                │
│ ○ 随机练习                     │
│   每次进入随机打乱题目顺序     │
│                                │
│ ☐ 记住我的选择                 │
│                                │
│     [开始练习]  [取消]         │
└────────────────────────────────┘
```

理由：
- 单选按钮清晰表达"二选一"
- 描述文字帮助用户理解差异
- "记住选择"是可选的，给用户控制权
- [取消] 按钮允许用户返回 Dashboard

### 决策 5: 不保存随机种子

**选择：每次进入练习都重新随机，不保存顺序**

替代方案考虑：
- 保存随机种子到 sessionStorage → 增加复杂度，收益有限

理由：
- 更简单的实现
- 符合"随机"的直观理解
- 答题状态基于 questionId 持久化，不会因重新随机而丢失
- 用户可以通过题目导航面板跳转到任意题目

### 决策 6: 练习页面状态显示

**选择：在模式图标旁显示 🔀 emoji**

顺序模式：`📝 练习模式 | 马克思主义基本原理`
随机模式：`📝 练习模式 🔀 | 马克思主义基本原理`

替代方案考虑：
- 文字标签 "随机顺序" → 占用更多空间
- 不显示 → 用户可能忘记当前模式

理由：
- 简洁直观
- emoji 跨语言通用
- 不占用过多空间

## 风险 / 权衡

### 风险 1: 用户在随机模式下迷失方向
**缓解措施**:
- 题目导航面板仍然按当前顺序编号，保持一致性
- 答题状态（✓✗）持久化，用户可以看到哪些题做过
- 进度条显示总体完成度

### 风险 2: 模态框增加操作步骤
**缓解措施**:
- "记住选择"功能让用户只需选择一次
- 如果已保存偏好，直接跳过模态框
- [取消] 按钮允许用户退出

### 风险 3: 随机后题目导航面板的题号含义变化
**权衡**:
- 接受这个变化，因为随机的目的就是打破位置记忆
- 导航面板仍然有效（题号对应当前顺序位置）
- 不显示原始题号，避免混淆

### 风险 4: 用户可能想修改已保存的偏好
**缓解措施**:
- 在 Dashboard 顶部显示当前默认模式
- 提供"修改默认设置"链接，重新弹出模态框并清除保存的偏好
- 或者用户可以清除浏览器 localStorage

## 实现要点

### 修改 `startPractice()` 函数

```javascript
async function startPractice(subject) {
  // 1. 检查用户偏好
  const preferredMode = Storage.get('preferredPracticeMode', null);

  // 2. 如果没有偏好，显示模态框
  let mode;
  if (preferredMode === null) {
    mode = await showModeSelectionModal();
  } else {
    mode = preferredMode;
  }

  // 3. 加载题目
  const questions = await QuestionLoader.load(subject);

  // 4. 根据模式处理题目顺序
  if (mode === 'random') {
    state.questions = shuffle(questions);
    state.isRandomMode = true;
  } else {
    state.questions = questions;
    state.isRandomMode = false;
  }

  // 5. 其他初始化逻辑...
  state.currentSubject = subject;
  state.currentQuestionIndex = 0;
  // ...
}
```

### 模态框实现

- HTML: 在 `index.html` 中添加隐藏的模态框结构
- CSS: 使用现有的渐变主题样式，保持视觉一致性
- JavaScript:
  - `showModeSelectionModal()` 返回 Promise，resolve 用户选择
  - 处理 checkbox 状态，保存到 localStorage
  - ESC 键关闭模态框（等同于取消）

### Dashboard 设置入口

在 Dashboard header 添加：
```html
<div class="settings-info">
  当前默认：<span id="current-mode">未设置</span>
  <button onclick="clearPracticeMode()">修改</button>
</div>
```

`clearPracticeMode()` 函数清除 localStorage 中的偏好，下次进入练习时重新弹出模态框。
