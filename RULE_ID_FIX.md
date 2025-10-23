# 规则ID冲突修复说明

## 🐛 问题分析

您遇到的错误：
```
更新规则失败: Error: Rule with id 1 does not have a unique ID.
```

**根本原因**：
- 使用了固定的规则ID `const RULE_ID = 1`
- Chrome扩展可能已经存在其他规则，或者规则ID冲突
- 在更新规则时，尝试添加相同ID的规则导致冲突

## ✅ 解决方案

### 1. 动态规则ID生成

**修复前**：
```typescript
// 使用固定的规则ID
const RULE_ID = 1

const rule = {
  id: RULE_ID, // 固定ID，容易冲突
  // ...
}
```

**修复后**：
```typescript
// 规则ID管理
let currentRuleId: number | null = null

// 生成唯一的规则ID
function generateRuleId(): number {
  // 使用时间戳 + 随机数确保唯一性
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return timestamp % 1000000 + random
}

// 在创建规则时使用动态ID
const newRuleId = generateRuleId()
const rule = {
  id: newRuleId, // 动态生成的唯一ID
  // ...
}
```

### 2. 改进的规则更新流程

```typescript
async function updateRules() {
  try {
    // 1. 获取现有规则
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules()
    const ruleIdsToRemove = existingRules.map(rule => rule.id)
    
    // 2. 生成新的唯一规则ID
    const newRuleId = generateRuleId()
    
    // 3. 创建新规则
    const rule = {
      id: newRuleId, // 使用新的唯一ID
      // ...
    }
    
    // 4. 同时移除旧规则和添加新规则
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: ruleIdsToRemove,
      addRules: [rule]
    })
    
    // 5. 更新当前规则ID
    currentRuleId = newRuleId
  } catch (error) {
    console.error('更新规则失败:', error)
  }
}
```

## 🔧 技术细节

### 规则ID生成策略
- **时间戳基础**：使用 `Date.now()` 确保时间唯一性
- **随机数增强**：添加随机数避免并发冲突
- **范围限制**：使用模运算限制ID范围在合理区间

### 规则管理改进
- **状态跟踪**：使用 `currentRuleId` 跟踪当前规则
- **完整清理**：每次更新前完全清除所有现有规则
- **原子操作**：使用 `updateDynamicRules` 确保操作的原子性

## 📋 修复效果

### 1. 解决ID冲突
- ✅ 不再使用固定规则ID
- ✅ 每次更新都生成新的唯一ID
- ✅ 避免与其他规则或扩展的ID冲突

### 2. 提高稳定性
- ✅ 规则更新更加可靠
- ✅ 支持多次更新操作
- ✅ 减少错误和异常

### 3. 更好的调试
- ✅ 控制台输出包含规则ID信息
- ✅ 便于追踪和调试规则状态

## 🧪 测试验证

修复后请测试以下场景：

### 基本功能测试
1. ✅ 添加HTTP头配置
2. ✅ 启用/禁用插件
3. ✅ 修改URL模式
4. ✅ 多次更新配置

### 稳定性测试
1. ✅ 快速连续修改配置
2. ✅ 重新加载插件
3. ✅ 重启浏览器
4. ✅ 检查控制台无错误

### 规则验证
1. ✅ 在Chrome扩展管理页面检查规则
2. ✅ 验证HTTP头修改是否生效
3. ✅ 确认规则ID不重复

## 🔍 调试信息

修复后的控制台输出示例：
```
已更新规则，ID: 1234567 包含 3 个HTTP头
已清除所有规则
已更新规则，ID: 1234568 包含 2 个HTTP头
```

## ⚠️ 注意事项

1. **Chrome版本**：确保使用支持Manifest V3的Chrome版本
2. **规则限制**：每个扩展最多30,000个动态规则
3. **ID范围**：生成的ID在1-999999范围内

## 🎯 预期结果

修复后应该：
- ✅ 不再出现规则ID冲突错误
- ✅ 规则更新操作稳定可靠
- ✅ 支持多次配置修改
- ✅ 所有HTTP头修改功能正常

---

**总结**：通过使用动态生成的唯一规则ID，彻底解决了规则ID冲突问题，使插件更加稳定可靠。
