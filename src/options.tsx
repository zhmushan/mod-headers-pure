import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { ProfileSelector } from '@/components/features/ProfileSelector'
import { HeaderRuleForm } from '@/components/features/HeaderRuleForm'
import { useAppStore, useActiveProfile } from '@/stores/useAppStore'
import { HeaderRule, AppSettings } from '@/types'
import { Plus, Settings, Download, Upload, Trash2, Save } from 'lucide-react'
import './styles/globals.css'

const OptionsApp: React.FC = () => {
  const {
    profiles,
    activeProfile,
    settings,
    isLoading,
    error,
    createProfile,
    updateProfile,
    setActiveProfile,
    deleteProfile,
    updateSettings,
    loadData,
    saveData
  } = useAppStore()

  const activeProfileData = useActiveProfile()

  const [showCreateProfile, setShowCreateProfile] = useState(false)
  const [, setShowEditProfile] = useState<string | null>(null)
  const [showCreateRule, setShowCreateRule] = useState(false)
  const [showEditRule, setShowEditRule] = useState<HeaderRule | null>(null)
  const [newProfileName, setNewProfileName] = useState('')
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  const handleCreateProfile = () => {
    if (newProfileName.trim()) {
      createProfile({
        name: newProfileName.trim(),
        description: '',
        rules: [],
        enabled: true
      })
      setNewProfileName('')
      setShowCreateProfile(false)
    }
  }

  const handleEditProfile = (profileId: string) => {
    setShowEditProfile(profileId)
  }

  const handleDeleteProfile = (profileId: string) => {
    deleteProfile(profileId)
  }

  const handleCreateRule = () => {
    setShowCreateRule(true)
  }

  const handleEditRule = (rule: HeaderRule) => {
    setShowEditRule(rule)
  }

  const handleSaveRule = (rule: HeaderRule) => {
    if (activeProfileData) {
      const updatedRules = showEditRule
        ? activeProfileData.rules.map(r => r.id === rule.id ? rule : r)
        : [...activeProfileData.rules, rule]

      updateProfile(activeProfileData.id, { rules: updatedRules })
    }
    setShowCreateRule(false)
    setShowEditRule(null)
  }

  const handleDeleteRule = (ruleId: string) => {
    if (activeProfileData) {
      const updatedRules = activeProfileData.rules.filter(r => r.id !== ruleId)
      updateProfile(activeProfileData.id, { rules: updatedRules })
    }
  }

  const handleToggleRule = (ruleId: string, enabled: boolean) => {
    if (activeProfileData) {
      const updatedRules = activeProfileData.rules.map(r =>
        r.id === ruleId ? { ...r, enabled } : r
      )
      updateProfile(activeProfileData.id, { rules: updatedRules })
    }
  }

  const handleSaveSettings = () => {
    updateSettings(localSettings)
    saveData()
  }

  const handleExportConfig = () => {
    const config = {
      profiles,
      activeProfile,
      settings,
      exportTime: new Date().toISOString(),
      version: '1.0.0'
    }
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `modheaders-config-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportConfig = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const config = JSON.parse(e.target?.result as string)
            // 验证配置格式
            if (config.profiles && Array.isArray(config.profiles)) {
              // 这里应该实现导入逻辑
              console.log('导入配置:', config)
            }
          } catch (error) {
            console.error('导入配置失败:', error)
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleClearAllData = () => {
    if (confirm('确定要清除所有数据吗？此操作不可撤销。')) {
      // 实现清除所有数据的逻辑
      console.log('清除所有数据')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-2">加载失败</p>
              <p className="text-sm text-red-500 mb-4">{error}</p>
              <Button variant="outline" size="sm" onClick={loadData}>
                重试
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">ModHeaders Modern 设置</h1>
          <p className="text-muted-foreground mt-2">
            管理您的HTTP头修改配置和插件设置
          </p>
        </div>

        <Tabs defaultValue="profiles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profiles">配置档案</TabsTrigger>
            <TabsTrigger value="rules">规则管理</TabsTrigger>
            <TabsTrigger value="settings">插件设置</TabsTrigger>
            <TabsTrigger value="data">数据管理</TabsTrigger>
          </TabsList>

          <TabsContent value="profiles" className="space-y-6">
            {showCreateProfile ? (
              <Card className="max-w-md">
                <CardHeader>
                  <CardTitle>新建配置档案</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">档案名称</label>
                    <Input
                      value={newProfileName}
                      onChange={(e) => setNewProfileName(e.target.value)}
                      placeholder="输入档案名称"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleCreateProfile} disabled={!newProfileName.trim()}>
                      创建
                    </Button>
                    <Button variant="outline" onClick={() => setShowCreateProfile(false)}>
                      取消
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <ProfileSelector
                profiles={profiles}
                selectedProfile={activeProfile}
                onSelect={setActiveProfile}
                onCreate={() => setShowCreateProfile(true)}
                onEdit={handleEditProfile}
                onDelete={handleDeleteProfile}
              />
            )}
          </TabsContent>

          <TabsContent value="rules" className="space-y-6">
            {showCreateRule || showEditRule ? (
              <HeaderRuleForm
                rule={showEditRule || undefined}
                onSave={handleSaveRule}
                onCancel={() => {
                  setShowCreateRule(false)
                  setShowEditRule(null)
                }}
              />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">规则管理</h2>
                    <p className="text-muted-foreground">
                      当前档案: {activeProfileData?.name || '无'}
                    </p>
                  </div>
                  <Button onClick={handleCreateRule}>
                    <Plus className="w-4 h-4 mr-2" />
                    新建规则
                  </Button>
                </div>

                {activeProfileData?.rules.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-medium mb-2">暂无规则</h3>
                      <p className="text-muted-foreground mb-6">
                        为当前档案创建HTTP头修改规则
                      </p>
                      <Button onClick={handleCreateRule} size="lg">
                        <Plus className="w-5 h-5 mr-2" />
                        创建第一个规则
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {activeProfileData?.rules.map((rule) => (
                      <Card key={rule.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Switch
                                checked={rule.enabled}
                                onCheckedChange={(checked) => handleToggleRule(rule.id, checked)}
                              />
                              <div>
                                <CardTitle className="text-lg">{rule.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                  {rule.type === 'request' ? '请求头' : '响应头'} • {rule.urlPattern}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-muted-foreground">
                                {rule.headers.length} 个头
                              </span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditRule(rule)}
                              >
                                编辑
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteRule(rule.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        {rule.headers.length > 0 && (
                          <CardContent>
                            <div className="space-y-2">
                              <h4 className="font-medium">HTTP头配置:</h4>
                              <div className="space-y-1">
                                {rule.headers.map((header) => (
                                  <div key={header.id} className="flex items-center justify-between text-sm p-2 bg-muted rounded">
                                    <span className={`${header.enabled ? 'text-foreground' : 'text-muted-foreground'}`}>
                                      {header.name}: {header.value}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {header.action}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>插件设置</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">主题</label>
                      <p className="text-xs text-muted-foreground">选择插件的显示主题</p>
                    </div>
                    <select
                      value={localSettings.theme}
                      onChange={(e) => setLocalSettings(prev => ({ 
                        ...prev, 
                        theme: e.target.value as 'light' | 'dark' | 'system' 
                      }))}
                      className="px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="light">浅色</option>
                      <option value="dark">深色</option>
                      <option value="system">跟随系统</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">语言</label>
                      <p className="text-xs text-muted-foreground">选择界面语言</p>
                    </div>
                    <select
                      value={localSettings.language}
                      onChange={(e) => setLocalSettings(prev => ({ 
                        ...prev, 
                        language: e.target.value as 'zh-CN' | 'en' 
                      }))}
                      className="px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="zh-CN">简体中文</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">自动保存</label>
                      <p className="text-xs text-muted-foreground">自动保存配置更改</p>
                    </div>
                    <Switch
                      checked={localSettings.autoSave}
                      onCheckedChange={(checked) => setLocalSettings(prev => ({ ...prev, autoSave: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">显示通知</label>
                      <p className="text-xs text-muted-foreground">显示插件操作通知</p>
                    </div>
                    <Switch
                      checked={localSettings.showNotifications}
                      onCheckedChange={(checked) => setLocalSettings(prev => ({ ...prev, showNotifications: checked }))}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveSettings}>
                    <Save className="w-4 h-4 mr-2" />
                    保存设置
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>数据导出</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    导出所有配置数据到JSON文件，用于备份或迁移
                  </p>
                  <Button onClick={handleExportConfig}>
                    <Download className="w-4 h-4 mr-2" />
                    导出配置
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>数据导入</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    从JSON文件导入配置数据
                  </p>
                  <Button variant="outline" onClick={handleImportConfig}>
                    <Upload className="w-4 h-4 mr-2" />
                    导入配置
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600">危险操作</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    清除所有配置数据，此操作不可撤销
                  </p>
                  <Button variant="destructive" onClick={handleClearAllData}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    清除所有数据
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// 渲染应用
const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(<OptionsApp />)
}
