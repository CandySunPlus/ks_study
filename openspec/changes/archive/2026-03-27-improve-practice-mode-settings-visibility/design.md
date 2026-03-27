## 上下文

当前练习模式设置位于 Dashboard header，显示为内联文本加小字链接：
```html
<div class="practice-mode-settings">
  <span>当前默认：<span id="current-mode-display">随机练习</span></span>
  <button id="clear-mode-btn" class="btn-link">修改</button>
</div>
```

样式为简单的文本和下划线链接，容易被忽略。用户在探索阶段提出担忧：如果看不到"修改"按钮，可能会误用"清除数据"来修改偏好。

现有设计系统：
- Dashboard 已有统计卡片和科目卡片样式
- 使用紫蓝渐变主题、阴影、圆角
- 按钮有 `btn-primary`、`btn-secondary`、`btn-danger` 等样式

约束：
- 纯前端实现，无后端
- 保持现有功能逻辑不变
- 复用现有设计系统

## 目标 / 非目标

**目标：**
- 提高练习模式设置的可见性和可发现性
- 使用卡片样式使其更显眼
- 将"修改"操作改为更明显的按钮
- 保持与现有 Dashboard 设计的一致性

**非目标：**
- 不改变功能逻辑或行为
- 不添加新功能
- 不修改"清除数据"的行为（这是另一个问题，可以单独处理）
- 不创建新的设计模式（复用现有）

## 决策

### 决策 1: 使用卡片布局

**选择：独立的卡片样式，类似统计卡片**

替代方案考虑：
- A. 保持内联但加粗文字 → 改进有限
- B. 使用横幅样式 → 太突出，喧宾夺主
- C. 卡片样式 → 适度显眼，与现有设计一致

理由：
- 卡片是 Dashboard 的主要设计语言
- 视觉层次清晰
- 不会过于突出影响其他内容
- 易于扩展（未来可能添加其他设置）

### 决策 2: 卡片内容结构

**选择：图标 + 标签 + 值 + 按钮的横向一行布局**

```
┌──────────────────────────────────────────────┐
│ 📝 练习模式：随机练习          [修改模式]   │
└──────────────────────────────────────────────┘
```

替代方案考虑：
- 垂直布局 → 占用过多垂直空间（初始方案，已改进）
- 只有文字无图标 → 不够吸引眼球
- 使用 primary 按钮 → 过于强调

理由：
- 横向一行布局最小化垂直空间占用
- 图标增加可识别性
- secondary 按钮适合次要操作
- 所有信息一目了然
- 移动端也能正常显示（使用响应式字体和间距）

### 决策 3: 卡片位置

**选择：放在统计面板下方、科目列表上方**

```
Dashboard 布局：
┌─────────────────┐
│ Header          │
├─────────────────┤
│ 统计面板        │ ← 现有
├─────────────────┤
│ 练习模式卡片    │ ← 新增（仅在有偏好时显示）
├─────────────────┤
│ 科目列表        │ ← 现有
├─────────────────┤
│ 数据管理按钮    │ ← 现有
└─────────────────┘
```

理由：
- 在统计之后逻辑合理（先看数据，再看设置）
- 在科目之前，避免被忽略
- 只在有偏好时显示，不占用不必要空间

### 决策 4: 样式细节

**选择：复用现有卡片样式类**

```css
.practice-mode-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 20px;
  /* 其他样式... */
}
```

理由：
- 保持视觉一致性
- 减少 CSS 代码量
- 易于维护

### 决策 5: 按钮样式

**选择：使用 `btn-secondary` 类，添加 `btn-small` 变体**

理由：
- `btn-secondary` 适合次要操作
- 小尺寸按钮在卡片中更协调
- 与"返回"按钮等保持一致

## 风险 / 权衡

### 风险 1: 占用更多垂直空间
**权衡**: 卡片比内联文本占用更多空间
**缓解措施**:
- 只在用户保存了偏好时显示
- 使用横向一行布局，最小化垂直占用（已实现）
- 紧凑的 padding 设计（14px 20px）

### 风险 2: 可能与统计卡片视觉冲突
**权衡**: 两个卡片挨在一起可能显得拥挤
**缓解措施**:
- 使用适当的间距（margin-bottom: 24px）
- 练习模式卡片更扁平，避免喧宾夺主
- 使用相同的视觉风格保持一致性

### 风险 3: 移动端显示
**权衡**: 小屏幕上横向布局可能拥挤
**缓解措施**:
- 响应式设计，移动端使用更小的字体和间距
- 所有元素设置 `flex-shrink: 0` 防止压缩变形
- 减小 gap 从 12px 到 8px

## 实现要点

### HTML 结构

扁平化结构，所有元素都是卡片的直接子元素，便于横向布局：

```html
<div id="practice-mode-card" class="practice-mode-card" style="display: none;">
  <span class="card-icon">📝</span>
  <span class="card-label">练习模式：</span>
  <span class="card-value" id="current-mode-display">随机练习</span>
  <button id="clear-mode-btn" class="btn btn-secondary btn-small">修改模式</button>
</div>
```

### CSS 样式

横向一行布局，最小化垂直空间占用：

```css
.practice-mode-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 14px 20px;
  margin: 0 auto 24px;
  max-width: 100%;
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 12px;
}

.practice-mode-card .card-icon {
  font-size: 1.1rem;
  flex-shrink: 0;
}

.practice-mode-card .card-label {
  font-size: 0.95rem;
  color: var(--text-secondary);
  font-weight: 500;
  flex-shrink: 0;
}

.practice-mode-card .card-value {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--primary);
  flex-shrink: 0;
}

.practice-mode-card .btn-small {
  padding: 6px 14px;
  font-size: 0.9rem;
  flex-shrink: 0;
  margin-left: auto;
}

@media (max-width: 768px) {
  .practice-mode-card {
    padding: 12px 16px;
    margin-bottom: 20px;
    gap: 8px;
  }

  .practice-mode-card .card-icon {
    font-size: 1rem;
  }

  .practice-mode-card .card-label {
    font-size: 0.85rem;
  }

  .practice-mode-card .card-value {
    font-size: 0.85rem;
  }

  .practice-mode-card .btn-small {
    padding: 6px 12px;
    font-size: 0.85rem;
  }
}
```

### JavaScript 修改

`updatePracticeModeSettings()` 函数更新 DOM 选择器和显示样式：

```javascript
function updatePracticeModeSettings() {
    const preferredMode = Storage.get('preferredPracticeMode', null);
    const settingsDiv = document.getElementById('practice-mode-card'); // 改为 practice-mode-card
    const modeDisplay = document.getElementById('current-mode-display');

    if (preferredMode) {
        settingsDiv.style.display = 'block'; // 改为 block（原为 flex）
        modeDisplay.textContent = preferredMode === 'random' ? '随机练习' : '顺序练习';
    } else {
        settingsDiv.style.display = 'none';
    }
}
```
