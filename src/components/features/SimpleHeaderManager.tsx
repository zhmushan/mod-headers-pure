import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2 } from 'lucide-react'
import { generateId } from '@/lib/utils'

interface HeaderItem {
  id: string
  name: string
  value: string
  enabled: boolean
}

interface SimpleHeaderManagerProps {
  headers: HeaderItem[]
  onHeadersChange: (headers: HeaderItem[]) => void
  title?: string
}

export const SimpleHeaderManager: React.FC<SimpleHeaderManagerProps> = ({
  headers,
  onHeadersChange,
  title = "HTTP头管理"
}) => {
  const [localHeaders, setLocalHeaders] = useState<HeaderItem[]>(headers)

  useEffect(() => {
    setLocalHeaders(headers)
  }, [headers])

  const addHeader = () => {
    const newHeader: HeaderItem = {
      id: generateId(),
      name: '',
      value: '',
      enabled: true
    }
    const updatedHeaders = [...localHeaders, newHeader]
    setLocalHeaders(updatedHeaders)
    onHeadersChange(updatedHeaders)
  }

  const updateHeader = (id: string, field: keyof HeaderItem, value: string | boolean) => {
    const updatedHeaders = localHeaders.map(header =>
      header.id === id ? { ...header, [field]: value } : header
    )
    setLocalHeaders(updatedHeaders)
    onHeadersChange(updatedHeaders)
  }

  const removeHeader = (id: string) => {
    const updatedHeaders = localHeaders.filter(header => header.id !== id)
    setLocalHeaders(updatedHeaders)
    onHeadersChange(updatedHeaders)
  }

  const toggleHeader = (id: string) => {
    const updatedHeaders = localHeaders.map(header =>
      header.id === id ? { ...header, enabled: !header.enabled } : header
    )
    setLocalHeaders(updatedHeaders)
    onHeadersChange(updatedHeaders)
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Button onClick={addHeader} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          添加头
        </Button>
      </div>
      <div>
        {localHeaders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>暂无HTTP头配置</p>
            <p className="text-sm mt-1">点击"添加头"开始配置</p>
          </div>
        ) : (
          <div className="space-y-4">
            {localHeaders.map((header) => (
              <div key={header.id} className="border rounded-lg bg-card p-4">
                {/* 头部：复选框和删除按钮 */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={header.enabled}
                      onChange={() => toggleHeader(header.id)}
                      className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-muted-foreground">
                      {header.enabled ? '已启用' : '已禁用'}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeHeader(header.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* 头名称 */}
                <div className="space-y-2 mb-3">
                  <label className="text-sm font-medium text-muted-foreground">Header Name</label>
                  <Input
                    value={header.name}
                    onChange={(e) => updateHeader(header.id, 'name', e.target.value)}
                    placeholder="例如: x-custom-header, Authorization, User-Agent"
                    className="text-sm font-mono"
                  />
                </div>

                {/* 头值 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Header Value</label>
                  <Input
                    value={header.value}
                    onChange={(e) => updateHeader(header.id, 'value', e.target.value)}
                    placeholder="例如: Bearer token123, Mozilla/5.0..., custom-value"
                    className="text-sm font-mono"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
