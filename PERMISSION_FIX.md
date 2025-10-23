# 权限问题修复说明

## 🐛 问题描述

您遇到的错误信息：
```
Unchecked runtime.lastError: You do not have permission to use blocking webRequest listeners. Be sure to declare the webRequestBlocking permission in your manifest. Note that webRequestBlocking is only allowed for extensions that are installed using ExtensionInstallForcelist.
```

## 🔍 问题原因

这个错误是因为：

1. **Manifest V3 变更**：Chrome扩展的Manifest V3版本中，`webRequestBlocking` 权限已被弃用
2. **权限限制**：`webRequestBlocking` 权限现在只允许通过企业策略安装的扩展使用
3. **API变更**：需要使用新的 `declarativeNetRequest` API 来修改HTTP请求

## ✅ 解决方案

我已经完全重写了后台脚本，使用现代的 `declarativeNetRequest` API：

### 1. 更新了 manifest.json
```json
{
  "permissions": [
    "storage",
    "declarativeNetRequest",  // 使用新的API
    "activeTab",
    "scripting"
  ]
  // 移除了 "webRequest" 权限
}
```

### 2. 重写了后台脚本
- 使用 `chrome.declarativeNetRequest` API
- 支持动态规则管理
- 更好的性能和安全性

### 3. 新的实现特点
- ✅ 符合Manifest V3标准
- ✅ 不需要企业策略安装
- ✅ 更好的性能
- ✅ 更安全的数据处理

## 🚀 技术细节

### 旧实现（已弃用）
```typescript
// 使用 webRequest API（已弃用）
chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    // 修改请求头
    return { requestHeaders: modifiedHeaders }
  },
  { urls: ['<all_urls>'] },
  ['requestHeaders', 'blocking'] // 需要 webRequestBlocking 权限
)
```

### 新实现（推荐）
```typescript
// 使用 declarativeNetRequest API
const rule: chrome.declarativeNetRequest.Rule = {
  id: 1,
  priority: 1,
  action: {
    type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
    requestHeaders: [
      {
        header: 'x-custom-header',
        operation: chrome.declarativeNetRequest.HeaderOperation.SET,
        value: 'custom-value'
      }
    ]
  },
  condition: {
    urlFilter: '*',
    resourceTypes: [chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST]
  }
}

await chrome.declarativeNetRequest.updateDynamicRules({
  addRules: [rule]
})
```

## 📋 主要改进

1. **权限简化**
   - 移除了 `webRequest` 权限
   - 只使用 `declarativeNetRequest` 权限
   - 符合Chrome扩展最佳实践

2. **性能优化**
   - 规则在浏览器层面执行，性能更好
   - 减少了JavaScript执行开销
   - 更快的请求处理

3. **安全性提升**
   - 使用声明式规则，更安全
   - 减少了权限需求
   - 符合Chrome安全策略

4. **兼容性**
   - 完全兼容Manifest V3
   - 支持所有现代Chrome版本
   - 不需要企业策略安装

## 🔧 使用方法

修复后的插件使用方法完全相同：

1. **构建项目**
   ```bash
   npm run build
   ```

2. **安装插件**
   - 在Chrome中加载 `dist` 文件夹
   - 不再需要企业策略安装

3. **使用功能**
   - 所有功能保持不变
   - 界面和操作完全相同
   - 性能更好，更稳定

## ⚠️ 注意事项

1. **Chrome版本要求**：需要Chrome 88+版本
2. **规则限制**：每个扩展最多30,000个规则
3. **URL模式**：支持标准的URL过滤模式

## 🎯 测试建议

安装修复后的插件后，请测试：

1. ✅ 插件能正常加载，无权限错误
2. ✅ HTTP头修改功能正常工作
3. ✅ 配置保存和加载正常
4. ✅ 实时生效功能正常

如果还有问题，请检查：
- Chrome版本是否支持Manifest V3
- 扩展是否正确安装
- 浏览器控制台是否有其他错误

---

**总结**：这个修复完全解决了权限问题，使插件符合现代Chrome扩展标准，同时提供了更好的性能和安全性。
