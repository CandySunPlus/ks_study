## 1. 弹窗改造

- [x] 1.1 修改 index.html 中模式选择弹窗：去掉"记住选择"checkbox，新增第二组 radio（继续上次进度/全新开始）
- [x] 1.2 修改 showModeSelectionModal 函数：移除 preferredPracticeMode 逻辑，返回值增加 dataMode 字段（continue/fresh）

## 2. 数据清理

- [x] 2.1 实现 clearSubjectData(subject) 函数：清除 answeredQuestions[subject]、wrongAnswers[subject]、stats[subject]
- [x] 2.2 修改 startPractice 函数：根据 dataMode 决定是否调用 clearSubjectData，去掉 preferredPracticeMode 缓存逻辑

## 3. 复习模式修复

- [x] 3.1 修改 startReview 函数：移除 restoreSessionAnswersFromStorage 调用

## 4. 已答题目展示

- [x] 4.1 修改 renderMultipleChoiceQuestion 函数：检测当前题目是否已答，若已答则禁用选项、添加正确/错误高亮、显示 analysis、隐藏提交按钮
- [x] 4.2 添加 CSS 样式：已答正确选项绿色高亮、已答错误选项红色高亮

## 5. 验证

- [x] 5.1 手动测试所有场景：继续进度、全新开始、复习模式、已答题目展示
