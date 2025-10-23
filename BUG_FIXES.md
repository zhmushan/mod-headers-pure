# Bug修复说明

## 🐛 修复的问题

### 1. 规则ID重复问题

**错误信息**：
```
更新规则失败: Error: Rule with id 1 does not have a unique ID.
```

**问题原因**：
- 在更新规则时，没有正确清除现有的规则
- 尝试添加相同ID的规则导致冲突

**解决方案**：
- 修改了 `updateRules()` 函数
- 在添加新规则前，先获取并移除所有现有规则
- 使用 `updateDynamicRules` 同时执行移除和添加操作

**修复代码**：
```typescript
// 修复前：只清除规则，然后添加新规则（可能导致ID冲突）
await clearAllRules()
await chrome.declarativeNetRequest.updateDynamicRules({
  addRules: [rule]
})

// 修复后：同时移除旧规则和添加新规则
const existingRules = await chrome.declarativeNetRequest.getDynamicRules()
const ruleIdsToRemove = existingRules.map(rule => rule.id)

await chrome.declarativeNetRequest.updateDynamicRules({
  removeRuleIds: ruleIdsToRemove,
  addRules: [rule]
})
```

### 2. 未勾选配置缓存问题

**问题描述**：
- 未勾选的HTTP头配置在重新打开插件后丢失
- 只有启用的头被保存，未启用的头被丢弃

**问题原因**：
- 在弹窗界面的 `notifyBackground()` 函数中，过滤了只发送启用的头
- 后台脚本只接收到启用的头，未启用的头没有被保存

**解决方案**：
- 修改了弹窗界面的数据发送逻辑
- 现在发送所有头（包括未启用的）到后台脚本
- 后台脚本保存所有头，但在创建规则时只使用启用的头

**修复代码**：
```typescript
// 修复前：只发送启用的头
headers: headers.filter(h => h.enabled && h.name.trim() && h.value.trim())

// 修复后：发送所有头
headers: headers // 发送所有头，包括未启用的
```

## ✅ 修复效果

### 1. 规则管理
- ✅ 不再出现规则ID重复错误
- ✅ 规则更新更加稳定可靠
- ✅ 支持动态添加/移除规则

### 2. 配置缓存
- ✅ 所有HTTP头配置都会被保存
- ✅ 未勾选的配置在重新打开后仍然存在
- ✅ 用户可以随时启用/禁用已保存的配置

## 🔧 技术细节

### 规则更新流程
1. 获取现有规则列表
2. 提取需要移除的规则ID
3. 根据当前配置创建新规则
4. 同时执行移除旧规则和添加新规则的操作

### 数据存储流程
1. 弹窗界面保存所有头配置（包括未启用的）
2. 发送完整配置到后台脚本
3. 后台脚本保存完整配置到Chrome存储
4. 创建规则时只使用启用的头

## 🧪 测试建议

修复后请测试以下场景：

### 规则管理测试
1. ✅ 添加多个HTTP头配置
2. ✅ 启用/禁用插件
3. ✅ 修改URL模式
4. ✅ 添加/删除HTTP头
5. ✅ 重新加载插件

### 配置缓存测试
1. ✅ 添加HTTP头但不勾选
2. ✅ 关闭插件弹窗
3. ✅ 重新打开插件弹窗
4. ✅ 确认未勾选的配置仍然存在
5. ✅ 勾选之前未启用的配置
6. ✅ 确认配置正常工作

## 📋 验证方法

### 检查规则是否正确创建
1. 打开Chrome开发者工具
2. 进入扩展管理页面
3. 查看插件详情
4. 检查是否有错误信息

### 检查配置是否正确保存
1. 添加一些HTTP头配置（部分勾选，部分不勾选）
2. 关闭插件弹窗
3. 重新打开插件弹窗
4. 确认所有配置都还在

### 检查HTTP头是否生效
1. 启用插件
2. 勾选一些HTTP头
3. 访问目标网站
4. 在开发者工具的Network标签页中检查请求头

---

**总结**：这两个修复解决了插件稳定性和数据持久性的关键问题，现在插件可以更可靠地管理HTTP头配置，并且所有配置都会被正确保存。
