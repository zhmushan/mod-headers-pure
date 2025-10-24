// 使用 declarativeNetRequest API 的新后台脚本

// 简化的头数据结构
interface SimpleHeaderItem {
  id: string
  name: string
  value: string
  enabled: boolean
}

interface SimpleConfig {
  headers: SimpleHeaderItem[]
  enabled: boolean
  urlPattern: string
}

// 存储当前配置
let currentConfig: SimpleConfig = {
  headers: [],
  enabled: false,
  urlPattern: '<all_urls>'
}

// 规则ID管理
let currentRuleId: number | null = null

// 生成唯一的规则ID
function generateRuleId(): number {
  // 使用时间戳 + 随机数确保唯一性
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return timestamp % 1000000 + random
}


// 清除所有规则
async function clearAllRules() {
  try {
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules()
    const ruleIdsToRemove = existingRules.map(rule => rule.id)
    
    if (ruleIdsToRemove.length > 0) {
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: ruleIdsToRemove
      })
    }
  } catch (error) {
    console.error('清除规则失败:', error)
  }
}

// 加载配置
async function loadConfig() {
  try {
    const result = await chrome.storage.local.get(['modheaders-pure-config'])
    if (result['modheaders-pure-config']) {
      currentConfig = result['modheaders-pure-config']
      await updateRules()
    }
  } catch (error) {
    console.error('加载配置失败:', error)
  }
}

// 更新规则
async function updateRules() {
  try {
    // 先获取现有规则
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules()
    const ruleIdsToRemove = existingRules.map(rule => rule.id)
    
    // 如果没有启用或没有有效的头，则只清除规则
    if (!currentConfig.enabled || currentConfig.headers.length === 0) {
      if (ruleIdsToRemove.length > 0) {
        await chrome.declarativeNetRequest.updateDynamicRules({
          removeRuleIds: ruleIdsToRemove
        })
      }
      currentRuleId = null
      console.log('已清除所有规则')
      return
    }
    
    // 过滤有效的头
    const validHeaders = currentConfig.headers.filter(h => 
      h.enabled && h.name.trim() && h.value.trim()
    )
    
    if (validHeaders.length === 0) {
      if (ruleIdsToRemove.length > 0) {
        await chrome.declarativeNetRequest.updateDynamicRules({
          removeRuleIds: ruleIdsToRemove
        })
      }
      currentRuleId = null
      console.log('已清除所有规则（无有效头）')
      return
    }
    
    // 生成新的规则ID
    const newRuleId = generateRuleId()
    
    // 创建规则
    const rule: chrome.declarativeNetRequest.Rule = {
      id: newRuleId,
      priority: 1,
      action: {
        type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
        requestHeaders: validHeaders.map(header => ({
          header: header.name,
          operation: chrome.declarativeNetRequest.HeaderOperation.SET,
          value: header.value
        }))
      },
      condition: {
        urlFilter: currentConfig.urlPattern === '<all_urls>' ? '*' : currentConfig.urlPattern,
        resourceTypes: [
          chrome.declarativeNetRequest.ResourceType.MAIN_FRAME,
          chrome.declarativeNetRequest.ResourceType.SUB_FRAME,
          chrome.declarativeNetRequest.ResourceType.STYLESHEET,
          chrome.declarativeNetRequest.ResourceType.SCRIPT,
          chrome.declarativeNetRequest.ResourceType.IMAGE,
          chrome.declarativeNetRequest.ResourceType.FONT,
          chrome.declarativeNetRequest.ResourceType.OBJECT,
          chrome.declarativeNetRequest.ResourceType.XMLHTTPREQUEST,
          chrome.declarativeNetRequest.ResourceType.PING,
          chrome.declarativeNetRequest.ResourceType.CSP_REPORT,
          chrome.declarativeNetRequest.ResourceType.MEDIA,
          chrome.declarativeNetRequest.ResourceType.WEBSOCKET,
          chrome.declarativeNetRequest.ResourceType.OTHER
        ]
      }
    }
    
    // 使用 updateDynamicRules 同时移除旧规则和添加新规则
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: ruleIdsToRemove,
      addRules: [rule]
    })
    
    currentRuleId = newRuleId
    console.log('已更新规则，ID:', newRuleId, '包含', validHeaders.length, '个HTTP头')
    
    // 通知所有content script状态更新
    notifyContentScripts()
  } catch (error) {
    console.error('更新规则失败:', error)
  }
}

// 通知所有content script状态更新
function notifyContentScripts() {
  const activeRuleCount = currentConfig.headers ? currentConfig.headers.filter(h => 
    h.enabled && h.name.trim() && h.value.trim()
  ).length : 0
  
  console.log('notifyContentScripts - currentConfig:', currentConfig, 'activeRuleCount:', activeRuleCount)
  
  chrome.tabs.query({}, (tabs) => {
    console.log('Found', tabs.length, 'tabs to notify')
    tabs.forEach(tab => {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, {
          type: 'UPDATE_STATUS',
          data: {
            enabled: currentConfig.enabled || false,
            ruleCount: activeRuleCount,
            urlPattern: currentConfig.urlPattern || '<all_urls>'
          }
        }).catch(() => {
          // 忽略无法发送消息的标签页（如chrome://页面）
        })
      }
    })
  })
}

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  switch (message.type) {
    case 'UPDATE_HEADERS':
      // 处理简化的头数据更新
      const config: SimpleConfig = message.data
      if (config) {
        currentConfig = {
          headers: config.headers || [],
          enabled: config.enabled || false,
          urlPattern: config.urlPattern || '<all_urls>'
        }
        
        // 保存配置
        chrome.storage.local.set({ 'modheaders-pure-config': currentConfig })
        
        // 更新规则
        updateRules().then(() => {
          sendResponse({ success: true })
        }).catch((error) => {
          console.error('更新规则失败:', error)
          sendResponse({ success: false, error: error.message })
        })
        
        return true // 保持消息通道开放
      }
      sendResponse({ success: false, error: 'Invalid config data' })
      break

    case 'GET_CONFIG':
      sendResponse({ config: currentConfig })
      break

    case 'GET_STATUS':
      const activeRuleCount = currentConfig.headers ? currentConfig.headers.filter(h => 
        h.enabled && h.name.trim() && h.value.trim()
      ).length : 0
      console.log('GET_STATUS - currentConfig:', currentConfig, 'activeRuleCount:', activeRuleCount)
      sendResponse({ 
        success: true, 
        data: {
          enabled: currentConfig.enabled || false,
          ruleCount: activeRuleCount,
          urlPattern: currentConfig.urlPattern || '<all_urls>'
        }
      })
      break

    case 'TOGGLE_EXTENSION':
      currentConfig.enabled = !currentConfig.enabled
      chrome.storage.local.set({ 'modheaders-pure-config': currentConfig })
      updateRules().then(() => {
        sendResponse({ success: true })
      }).catch((error) => {
        console.error('切换状态失败:', error)
        sendResponse({ success: false, error: error.message })
      })
      return true

    case 'OPEN_POPUP':
      // 打开popup页面
      chrome.action.openPopup()
      sendResponse({ success: true })
      break

    case 'CLEAR_RULES':
      clearAllRules().then(() => {
        sendResponse({ success: true })
      }).catch((error) => {
        sendResponse({ success: false, error: error.message })
      })
      return true

    default:
      sendResponse({ error: 'Unknown message type' })
  }
})

// 监听存储变化
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes['modheaders-pure-config']) {
    const newConfig = changes['modheaders-pure-config'].newValue
    if (newConfig) {
      currentConfig = newConfig
      updateRules()
    }
  }
})

// 错误处理
chrome.runtime.onStartup.addListener(() => {
  console.log('ModHeaders Pure 插件已启动')
  loadConfig()
})

// 插件启动时也加载配置
chrome.runtime.onInstalled.addListener(async () => {
  console.log('ModHeaders Pure 插件已安装')
  
  // 清除现有规则
  await clearAllRules()
  
  // 加载保存的配置
  await loadConfig()
})

// 定期清理和优化
setInterval(() => {
  // 可以在这里添加定期清理逻辑
}, 60000) // 每分钟执行一次
