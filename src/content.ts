// 内容脚本 - 在网页中注入的功能

// 检查是否已经注入
if (!(window as any).modHeadersInjected) {
  (window as any).modHeadersInjected = true

  // 创建浮动控制面板
  function createFloatingPanel() {
    const panel = document.createElement('div')
    panel.id = 'modheaders-floating-panel'
    panel.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 300px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      z-index: 2147483647;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      display: none;
    `

    panel.innerHTML = `
      <div style="padding: 16px; border-bottom: 1px solid #e5e7eb;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h3 style="margin: 0; font-size: 16px; font-weight: 600;">ModHeaders</h3>
          <button id="modheaders-close" style="background: none; border: none; font-size: 18px; cursor: pointer;">×</button>
        </div>
      </div>
      <div style="padding: 16px;">
        <div id="modheaders-status" style="margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <div id="modheaders-indicator" style="width: 8px; height: 8px; border-radius: 50%; background: #10b981;"></div>
            <span>插件已激活</span>
          </div>
        </div>
        <div id="modheaders-rules" style="margin-bottom: 12px;">
          <div style="font-size: 12px; color: #6b7280;">活动规则: <span id="modheaders-rule-count">0</span></div>
        </div>
        <div style="display: flex; gap: 8px;">
          <button id="modheaders-open-popup" style="flex: 1; padding: 8px 12px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
            打开设置
          </button>
          <button id="modheaders-toggle" style="flex: 1; padding: 8px 12px; background: #6b7280; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
            禁用
          </button>
        </div>
      </div>
    `

    document.body.appendChild(panel)

    // 绑定事件
    const closeBtn = panel.querySelector('#modheaders-close')
    const openPopupBtn = panel.querySelector('#modheaders-open-popup')
    const toggleBtn = panel.querySelector('#modheaders-toggle')

    closeBtn?.addEventListener('click', () => {
      panel.style.display = 'none'
    })

    openPopupBtn?.addEventListener('click', () => {
      chrome.runtime.sendMessage({ type: 'OPEN_POPUP' })
    })

    toggleBtn?.addEventListener('click', () => {
      chrome.runtime.sendMessage({ type: 'TOGGLE_EXTENSION' })
    })

    return panel
  }

  // 创建浮动按钮
  function createFloatingButton() {
    const button = document.createElement('div')
    button.id = 'modheaders-floating-button'
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      background: #3b82f6;
      border-radius: 50%;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      cursor: pointer;
      z-index: 2147483646;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 20px;
      transition: all 0.2s ease;
    `

    button.innerHTML = 'M'
    button.title = 'ModHeaders - 点击打开控制面板'

    button.addEventListener('click', () => {
      const panel = document.getElementById('modheaders-floating-panel')
    if (panel) {
      const panelElement = panel as HTMLElement
      panelElement.style.display = panelElement.style.display === 'none' ? 'block' : 'none'
    }
    })

    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.1)'
      button.style.background = '#2563eb'
    })

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)'
      button.style.background = '#3b82f6'
    })

    document.body.appendChild(button)
    return button
  }

  // 初始化浮动元素
  function initFloatingElements() {
    // 等待DOM加载完成
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        createFloatingButton()
        createFloatingPanel()
      })
    } else {
      createFloatingButton()
      createFloatingPanel()
    }
  }

  // 监听来自background的消息
  chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
    switch (message.type) {
      case 'UPDATE_STATUS':
        updateFloatingPanelStatus(message.data)
        break
      case 'TOGGLE_FLOATING_ELEMENTS':
        toggleFloatingElements(message.visible)
        break
    }
  })

  // 更新浮动面板状态
  function updateFloatingPanelStatus(data: any) {
    const panel = document.getElementById('modheaders-floating-panel')
    if (!panel) return

    const indicator = panel.querySelector('#modheaders-indicator')
    const ruleCount = panel.querySelector('#modheaders-rule-count')
    const toggleBtn = panel.querySelector('#modheaders-toggle') as HTMLButtonElement

    if (indicator) {
      (indicator as HTMLElement).style.background = data.enabled ? '#10b981' : '#ef4444'
    }

    if (ruleCount) {
      ruleCount.textContent = data.ruleCount || '0'
    }

    if (toggleBtn) {
      toggleBtn.textContent = data.enabled ? '禁用' : '启用'
      toggleBtn.style.background = data.enabled ? '#ef4444' : '#10b981'
    }
  }

  // 切换浮动元素显示
  function toggleFloatingElements(visible: boolean) {
    const button = document.getElementById('modheaders-floating-button')
    const panel = document.getElementById('modheaders-floating-panel')

    if (button) {
      button.style.display = visible ? 'flex' : 'none'
    }
    if (panel) {
      panel.style.display = 'none'
    }
  }

  // 页面性能监控
  function monitorPagePerformance() {
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing
      const loadTime = timing.loadEventEnd - timing.navigationStart
      
      // 发送性能数据到background
      chrome.runtime.sendMessage({
        type: 'PAGE_PERFORMANCE',
        data: {
          url: window.location.href,
          loadTime,
          domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
          firstPaint: timing.responseEnd - timing.navigationStart
        }
      })
    }
  }

  // 网络请求监控
  function monitorNetworkRequests() {
    const originalFetch = window.fetch

    // 监控fetch请求
    window.fetch = function(...args) {
      const startTime = Date.now()
      return originalFetch.apply(this, args).then(response => {
        const endTime = Date.now()
        chrome.runtime.sendMessage({
          type: 'NETWORK_REQUEST',
          data: {
            url: args[0],
            method: 'GET',
            status: response.status,
            duration: endTime - startTime,
            timestamp: startTime
          }
        })
        return response
      })
    }

    // 监控XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open
    const originalSend = XMLHttpRequest.prototype.send

    XMLHttpRequest.prototype.open = function(method: string, url: string | URL, async: boolean = true, username?: string | null, password?: string | null) {
      (this as any)._modHeadersMethod = method
      ;(this as any)._modHeadersUrl = url
      ;(this as any)._modHeadersStartTime = Date.now()
      return originalOpen.call(this, method, url, async, username, password)
    }

    XMLHttpRequest.prototype.send = function(body?: Document | XMLHttpRequestBodyInit | null) {
      this.addEventListener('loadend', () => {
        chrome.runtime.sendMessage({
          type: 'NETWORK_REQUEST',
          data: {
            url: (this as any)._modHeadersUrl,
            method: (this as any)._modHeadersMethod,
            status: this.status,
            duration: Date.now() - (this as any)._modHeadersStartTime,
            timestamp: (this as any)._modHeadersStartTime
          }
        })
      })
      return originalSend.call(this, body)
    }
  }

  // 初始化所有功能
  function init() {
    initFloatingElements()
    monitorPagePerformance()
    monitorNetworkRequests()

    // 请求当前状态
    chrome.runtime.sendMessage({ type: 'GET_STATUS' }, (response) => {
      if (response) {
        updateFloatingPanelStatus(response)
      }
    })
  }

  // 启动初始化
  init()

  // 页面卸载时清理
  window.addEventListener('beforeunload', () => {
    const button = document.getElementById('modheaders-floating-button')
    const panel = document.getElementById('modheaders-floating-panel')
    
    if (button) button.remove()
    if (panel) panel.remove()
  })
}

// 类型声明已移至 types/global.d.ts
