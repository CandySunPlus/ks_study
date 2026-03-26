## 为什么

在实现背题模式和解析显示功能后，发现题目解析（analysis）始终没有显示。经过排查，发现 `QuestionLoader.parseQuestions()` 函数在解析题目数据时遗漏了 `analysis` 字段，导致所有题目对象都不包含解析内容。这是一个数据解析层面的 bug，需要修复以确保解析功能正常工作。

## 变更内容

- **修复 QuestionLoader.parseQuestions**：添加 `analysis` 字段到解析后的题目对象中

## 功能 (Capabilities)

### 新增功能
无

### 修改功能
无（这是实现层面的 bug 修复，不涉及规范变更）

## 影响

- **app.js**：修改 `QuestionLoader.parseQuestions` 方法
- **数据格式**：无变化，只是正确读取已有数据
