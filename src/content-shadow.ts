// 内容脚本 - 使用Shadow DOM完全隔离样式

// 检查是否已经注入
if (!(window as any).modHeadersInjected) {
  (window as any).modHeadersInjected = true






  // 网络请求监控（保持原有功能）
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
