## 为什么

当前练习模式每次进入都会自动恢复上次的作答记录，用户无法选择"从头开始"重新刷题。同时复习错题时会显示之前选择的选项，失去了重新作答的意义。此外，练习模式下已答题目仅恢复了选中状态，没有展示对错反馈和解析，且仍可修改答案，不够直观。

## 变更内容

- 练习模式弹窗新增"继续上次进度 / 全新开始"选项，去掉"记住选择"checkbox，每次进入都显示弹窗
- 全新开始时清空当前科目的 answeredQuestions、wrongAnswers、stats
- 复习模式下不再恢复之前的选项，让用户重新作答
- 练习模式下已答选择题展示正确/错误高亮、解析(analysis)，并禁止修改

## 功能 (Capabilities)

### 新增功能
- `practice-session-options`: 练习入口的会话选项控制 — 选择继续或全新开始

### 修改功能
- `practice-mode-selection`: 弹窗改为包含答题顺序 + 数据选择两组选项，去掉记住选择功能
- `review-mode`: 不恢复之前的作答选项，进入时为空白状态
- `answered-questions-persistence`: 练习模式下已答选择题需展示结果反馈（正确/错误高亮、解析），并禁止二次修改

## 影响

- `app.js`: startPractice、startReview、renderMultipleChoiceQuestion、showModeSelectionModal 等函数
- `index.html`: 模式选择弹窗 HTML 结构
- `styles.css`: 已答题目正确/错误高亮样式
