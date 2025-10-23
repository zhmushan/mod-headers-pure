# HTTP头配置布局改进

## 🎯 改进目标

针对您提到的"key和value都是很长的，现在这样不方便读"的问题，我重新设计了HTTP头配置的布局，使其更适合显示长文本。

## 📱 新布局设计

### 改进前的问题
- 水平布局，key和value并排显示
- 空间有限，长文本被截断
- 难以阅读和编辑长内容

### 改进后的优势
- **垂直布局**：每个HTTP头配置独占一个卡片
- **全宽显示**：key和value都有充足的空间
- **多行支持**：value字段使用textarea，支持多行文本
- **清晰标识**：每个字段都有明确的标签

## 🎨 新布局特点

### 1. 卡片式设计
```
┌─────────────────────────────────────┐
│ ☑️ 已启用                    🗑️     │
├─────────────────────────────────────┤
│ Header Name                         │
│ ┌─────────────────────────────────┐ │
│ │ x-custom-very-long-header-name  │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Header Value                        │
│ ┌─────────────────────────────────┐ │
│ │ This is a very long header      │ │
│ │ value that can span multiple    │ │
│ │ lines for better readability    │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### 2. 改进的交互体验
- **状态显示**：清楚显示"已启用"或"已禁用"状态
- **标签说明**：每个字段都有明确的标签
- **占位符提示**：提供示例帮助用户理解
- **等宽字体**：使用 `font-mono` 提高代码可读性

### 3. 响应式设计
- **自适应高度**：textarea可以根据内容自动调整高度
- **可调整大小**：用户可以手动调整textarea大小
- **全宽利用**：充分利用可用空间

## 🔧 技术实现

### 布局结构
```typescript
<div className="space-y-4">
  {headers.map((header) => (
    <div className="border rounded-lg bg-card p-4">
      {/* 头部：状态和删除按钮 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <input type="checkbox" />
          <span>已启用/已禁用</span>
        </div>
        <Button>删除</Button>
      </div>

      {/* Header Name */}
      <div className="space-y-2 mb-3">
        <label>Header Name</label>
        <Input className="font-mono" />
      </div>

      {/* Header Value */}
      <div className="space-y-2">
        <label>Header Value</label>
        <textarea 
          className="font-mono min-h-[60px] resize-y"
          rows={2}
        />
      </div>
    </div>
  ))}
</div>
```

### 样式特点
- **等宽字体**：`font-mono` 提高代码可读性
- **最小高度**：`min-h-[60px]` 确保足够的编辑空间
- **可调整大小**：`resize-y` 允许垂直调整
- **清晰间距**：`space-y-4` 和 `mb-3` 提供良好的视觉分离

## 📋 使用体验

### 1. 长文本支持
- ✅ 支持很长的header名称
- ✅ 支持多行header值
- ✅ 自动换行显示
- ✅ 可手动调整高度

### 2. 编辑体验
- ✅ 清晰的字段标签
- ✅ 有用的占位符提示
- ✅ 等宽字体提高可读性
- ✅ 大尺寸的编辑区域

### 3. 视觉层次
- ✅ 卡片式设计清晰分离
- ✅ 状态信息一目了然
- ✅ 操作按钮位置合理
- ✅ 良好的间距和对比度

## 🎯 适用场景

### 长Header名称
```
x-custom-very-long-header-name-for-api-authentication
Authorization
User-Agent
X-Forwarded-For
```

### 长Header值
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### 多行值
```
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 
(KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36
```

## 🚀 优势总结

1. **更好的可读性**：垂直布局提供更多空间
2. **支持长文本**：textarea支持多行和长内容
3. **清晰的标识**：每个字段都有标签和状态
4. **更好的编辑体验**：大尺寸编辑区域和等宽字体
5. **响应式设计**：适应不同内容长度

---

**总结**：新的布局设计专门针对长文本进行了优化，提供了更好的可读性和编辑体验，特别适合处理复杂的HTTP头配置。
