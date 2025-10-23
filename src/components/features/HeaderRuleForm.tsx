import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { HeaderRule, HeaderEntry } from '@/types'
import { generateId, isValidUrlPattern, isValidHeaderName, isValidHeaderValue } from '@/lib/utils'
import { Plus, Trash2, Save, X } from 'lucide-react'

interface HeaderRuleFormProps {
  rule?: HeaderRule
  onSave: (rule: HeaderRule) => void
  onCancel: () => void
}

export const HeaderRuleForm: React.FC<HeaderRuleFormProps> = ({
  rule,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<HeaderRule>({
    id: rule?.id || generateId(),
    name: rule?.name || '',
    enabled: rule?.enabled ?? true,
    type: rule?.type || 'request',
    urlPattern: rule?.urlPattern || '<all_urls>',
    headers: rule?.headers || [],
    createdAt: rule?.createdAt || Date.now(),
    updatedAt: Date.now()
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setFormData(rule ? { ...rule, updatedAt: Date.now() } : {
      id: generateId(),
      name: '',
      enabled: true,
      type: 'request',
      urlPattern: '<all_urls>',
      headers: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    })
  }, [rule])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = '规则名称不能为空'
    }

    if (!isValidUrlPattern(formData.urlPattern)) {
      newErrors.urlPattern = 'URL模式格式不正确'
    }

    formData.headers.forEach((header, index) => {
      if (!isValidHeaderName(header.name)) {
        newErrors[`header_${index}_name`] = 'HTTP头名称格式不正确'
      }
      if (!isValidHeaderValue(header.value)) {
        newErrors[`header_${index}_value`] = 'HTTP头值格式不正确'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData)
    }
  }

  const addHeader = () => {
    const newHeader: HeaderEntry = {
      id: generateId(),
      name: '',
      value: '',
      enabled: true,
      action: 'set'
    }
    setFormData(prev => ({
      ...prev,
      headers: [...prev.headers, newHeader]
    }))
  }

  const removeHeader = (headerId: string) => {
    setFormData(prev => ({
      ...prev,
      headers: prev.headers.filter(h => h.id !== headerId)
    }))
  }

  const updateHeader = (headerId: string, updates: Partial<HeaderEntry>) => {
    setFormData(prev => ({
      ...prev,
      headers: prev.headers.map(h =>
        h.id === headerId ? { ...h, ...updates } : h
      )
    }))
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {rule ? '编辑规则' : '新建规则'}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              取消
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              保存
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 基本信息 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">规则名称</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="输入规则名称"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">规则类型</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                type: e.target.value as 'request' | 'response' 
              }))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="request">请求头</option>
              <option value="response">响应头</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">URL模式</label>
          <Input
            value={formData.urlPattern}
            onChange={(e) => setFormData(prev => ({ ...prev, urlPattern: e.target.value }))}
            placeholder="例如: https://example.com/* 或 <all_urls>"
            className={errors.urlPattern ? 'border-red-500' : ''}
          />
          {errors.urlPattern && <p className="text-sm text-red-500">{errors.urlPattern}</p>}
          <p className="text-xs text-muted-foreground">
            支持通配符 * 和 &lt;all_urls&gt; 匹配所有URL
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="enabled"
            checked={formData.enabled}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, enabled: checked }))}
          />
          <label htmlFor="enabled" className="text-sm font-medium">
            启用此规则
          </label>
        </div>

        {/* HTTP头列表 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">HTTP头配置</h3>
            <Button variant="outline" size="sm" onClick={addHeader}>
              <Plus className="w-4 h-4 mr-2" />
              添加头
            </Button>
          </div>

          {formData.headers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              暂无HTTP头配置，点击"添加头"开始配置
            </div>
          ) : (
            <div className="space-y-3">
              {formData.headers.map((header, index) => (
                <div key={header.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={header.enabled}
                      onCheckedChange={(checked) => updateHeader(header.id, { enabled: checked })}
                    />
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">名称</label>
                      <Input
                        value={header.name}
                        onChange={(e) => updateHeader(header.id, { name: e.target.value })}
                        placeholder="Header Name"
                        className={errors[`header_${index}_name`] ? 'border-red-500' : ''}
                      />
                      {errors[`header_${index}_name`] && (
                        <p className="text-xs text-red-500">{errors[`header_${index}_name`]}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">值</label>
                      <Input
                        value={header.value}
                        onChange={(e) => updateHeader(header.id, { value: e.target.value })}
                        placeholder="Header Value"
                        className={errors[`header_${index}_value`] ? 'border-red-500' : ''}
                      />
                      {errors[`header_${index}_value`] && (
                        <p className="text-xs text-red-500">{errors[`header_${index}_value`]}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-muted-foreground">操作</label>
                      <select
                        value={header.action}
                        onChange={(e) => updateHeader(header.id, { 
                          action: e.target.value as 'set' | 'remove' | 'modify' 
                        })}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="set">设置</option>
                        <option value="remove">删除</option>
                        <option value="modify">修改</option>
                      </select>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeHeader(header.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
