import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { SimpleHeaderManager } from '@/components/features/SimpleHeaderManager'
import { useSimpleStore } from '@/stores/useSimpleStoreV2'
import { Download, Upload, Trash2 } from 'lucide-react'
import './styles/globals.css'

const PopupSimpleApp: React.FC = () => {
  const {
    headers,
    enabled,
    urlPattern,
    isLoading,
    setHeaders,
    setEnabled,
    setUrlPattern,
    clearAll,
    loadFromStorage
  } = useSimpleStore()

  // 组件加载时从存储加载数据
  useEffect(() => {
    loadFromStorage()
  }, [])

  // 通知后台脚本更新规则
  const notifyBackground = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.sendMessage({
        type: 'UPDATE_HEADERS',
        data: {
          headers: headers, // 发送所有头，包括未启用的
          enabled,
          urlPattern
        }
      })
    }
  }

  useEffect(() => {
    notifyBackground()
  }, [headers, enabled, urlPattern])

  const handleExport = () => {
    const data = {
      headers,
      enabled,
      urlPattern,
      exportTime: new Date().toISOString(),
      version: '1.0.0'
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `modheaders-pure-config-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string)
            if (data.headers && Array.isArray(data.headers)) {
              setHeaders(data.headers)
              if (data.enabled !== undefined) setEnabled(data.enabled)
              if (data.urlPattern) setUrlPattern(data.urlPattern)
            }
          } catch (error) {
            console.error('导入配置失败:', error)
            alert('导入配置失败，请检查文件格式')
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleClearAll = () => {
    if (confirm('确定要清除所有配置吗？此操作不可撤销。')) {
      clearAll()
    }
  }

  if (isLoading) {
    return (
      <div className="w-96 h-[600px] flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-96 h-[600px] flex flex-col bg-background">
      {/* 头部 */}
      <div className="px-4 py-3 border-b bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">ModHeaders Pure</h1>
            <p className="text-sm text-muted-foreground">纯净的HTTP头修改工具</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${enabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-xs text-muted-foreground">
              {enabled ? '已启用' : '已禁用'}
            </span>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="flex-1 overflow-auto">
        {/* 全局控制 */}
        <div className="p-4 border-b">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">启用插件</label>
                <p className="text-xs text-muted-foreground">控制是否应用HTTP头修改</p>
              </div>
              <Switch
                checked={enabled}
                onCheckedChange={setEnabled}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">URL模式</label>
              <Input
                value={urlPattern}
                onChange={(e) => setUrlPattern(e.target.value)}
                placeholder="例如: https://example.com/* 或 <all_urls>"
                className="text-sm"
              />
              <p className="text-xs text-muted-foreground">
                支持通配符 * 和 &lt;all_urls&gt; 匹配所有URL
              </p>
            </div>
          </div>
        </div>

        {/* HTTP头管理 */}
        <div className="p-4">
          <SimpleHeaderManager
            headers={headers}
            onHeadersChange={setHeaders}
            title="请求头配置"
          />
        </div>

        {/* 操作按钮和状态信息 */}
        <div className="p-4 border-t bg-muted/30">
          <div className="space-y-3">
            {/* 操作按钮 */}
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                导出配置
              </Button>
              <Button variant="outline" size="sm" onClick={handleImport}>
                <Upload className="w-4 h-4 mr-2" />
                导入配置
              </Button>
              <Button variant="destructive" size="sm" onClick={handleClearAll}>
                <Trash2 className="w-4 h-4 mr-2" />
                清除所有
              </Button>
            </div>

            {/* 状态信息 */}
            <div className="text-center">
              <div className="text-sm">
                <span className="font-medium">活动规则: </span>
                <span className="text-muted-foreground">
                  {headers.filter(h => h.enabled && h.name.trim() && h.value.trim()).length}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">
                配置会自动保存并实时生效
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 渲染应用
const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(<PopupSimpleApp />)
}
