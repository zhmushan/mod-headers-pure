import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { ProfileSelector } from '@/components/features/ProfileSelector'
import { HeaderRuleForm } from '@/components/features/HeaderRuleForm'
import { useAppStore, useActiveProfile, useActiveRules } from '@/stores/useAppStore'
import { HeaderRule } from '@/types'
import { Plus, Settings, Activity, Info } from 'lucide-react'
import './styles/globals.css'

const PopupApp: React.FC = () => {
  const {
    profiles,
    activeProfile,
    isLoading,
    error,
    createProfile,
    updateProfile,
    setActiveProfile,
    deleteProfile,
    loadData
  } = useAppStore()

  const activeProfileData = useActiveProfile()
  const activeRules = useActiveRules()

  const [showCreateProfile, setShowCreateProfile] = useState(false)
  const [, setShowEditProfile] = useState<string | null>(null)
  const [showCreateRule, setShowCreateRule] = useState(false)
  const [showEditRule, setShowEditRule] = useState<HeaderRule | null>(null)
  const [newProfileName, setNewProfileName] = useState('')

  useEffect(() => {
    loadData()
  }, [])

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

  // const handleDeleteRule = (ruleId: string) => {
  //   if (activeProfileData) {
  //     const updatedRules = activeProfileData.rules.filter(r => r.id !== ruleId)
  //     updateProfile(activeProfileData.id, { rules: updatedRules })
  //   }
  // }

  const handleToggleRule = (ruleId: string, enabled: boolean) => {
    if (activeProfileData) {
      const updatedRules = activeProfileData.rules.map(r =>
        r.id === ruleId ? { ...r, enabled } : r
      )
      updateProfile(activeProfileData.id, { rules: updatedRules })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
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
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">ModHeaders Modern</h1>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${activeProfileData?.enabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-xs text-muted-foreground">
              {activeRules.length} 个活动规则
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="rules" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
            <TabsTrigger value="rules">规则</TabsTrigger>
            <TabsTrigger value="profiles">档案</TabsTrigger>
            <TabsTrigger value="status">状态</TabsTrigger>
          </TabsList>

          <TabsContent value="rules" className="flex-1 overflow-auto p-4 space-y-4">
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
                  <h2 className="text-lg font-medium">HTTP头规则</h2>
                  <Button size="sm" onClick={handleCreateRule}>
                    <Plus className="w-4 h-4 mr-2" />
                    新建规则
                  </Button>
                </div>

                {activeProfileData?.rules.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">暂无规则</h3>
                      <p className="text-muted-foreground mb-4">
                        创建您的第一个HTTP头修改规则
                      </p>
                      <Button onClick={handleCreateRule}>
                        <Plus className="w-4 h-4 mr-2" />
                        创建规则
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {activeProfileData?.rules.map((rule) => (
                      <Card key={rule.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Switch
                                checked={rule.enabled}
                                onCheckedChange={(checked) => handleToggleRule(rule.id, checked)}
                              />
                              <div>
                                <CardTitle className="text-base">{rule.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                  {rule.type === 'request' ? '请求头' : '响应头'} • {rule.urlPattern}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-muted-foreground">
                                {rule.headers.length} 个头
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditRule(rule)}
                              >
                                编辑
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        {rule.headers.length > 0 && (
                          <CardContent className="pt-0">
                            <div className="space-y-1">
                              {rule.headers.slice(0, 3).map((header) => (
                                <div key={header.id} className="flex items-center justify-between text-sm">
                                  <span className={`${header.enabled ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {header.name}: {header.value}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {header.action}
                                  </span>
                                </div>
                              ))}
                              {rule.headers.length > 3 && (
                                <div className="text-xs text-muted-foreground">
                                  还有 {rule.headers.length - 3} 个头...
                                </div>
                              )}
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

          <TabsContent value="profiles" className="flex-1 overflow-auto p-4">
            {showCreateProfile ? (
              <Card>
                <CardHeader>
                  <CardTitle>新建配置档案</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">档案名称</label>
                    <input
                      type="text"
                      value={newProfileName}
                      onChange={(e) => setNewProfileName(e.target.value)}
                      placeholder="输入档案名称"
                      className="mt-1 w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
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

          <TabsContent value="status" className="flex-1 overflow-auto p-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="w-5 h-5 mr-2" />
                  插件状态
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>当前档案</span>
                  <span className="font-medium">{activeProfileData?.name || '无'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>活动规则</span>
                  <span className="font-medium">{activeRules.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>档案状态</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${activeProfileData?.enabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="font-medium">{activeProfileData?.enabled ? '已启用' : '已禁用'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>快速操作</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  打开完整设置
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  导出配置
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  导入配置
                </Button>
              </CardContent>
            </Card>
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
  root.render(<PopupApp />)
}
