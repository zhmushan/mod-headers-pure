import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Profile } from '@/types'
import { Plus, Edit, Trash2, Settings } from 'lucide-react'
import { useAppStore } from '@/stores/useAppStore'

interface ProfileSelectorProps {
  profiles: Profile[]
  selectedProfile?: string
  onSelect: (profileId: string) => void
  onCreate: () => void
  onEdit: (profileId: string) => void
  onDelete: (profileId: string) => void
}

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({
  profiles,
  selectedProfile,
  onSelect,
  onCreate,
  onEdit,
  onDelete
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const { updateProfile } = useAppStore()

  const handleToggleProfile = (profileId: string, enabled: boolean) => {
    updateProfile(profileId, { enabled })
  }

  const handleDelete = (profileId: string) => {
    if (showDeleteConfirm === profileId) {
      onDelete(profileId)
      setShowDeleteConfirm(null)
    } else {
      setShowDeleteConfirm(profileId)
    }
  }

  const cancelDelete = () => {
    setShowDeleteConfirm(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">配置档案</h2>
        <Button onClick={onCreate} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          新建档案
        </Button>
      </div>

      <div className="grid gap-3">
        {profiles.map((profile) => (
          <Card 
            key={profile.id} 
            className={`cursor-pointer transition-all ${
              selectedProfile === profile.id 
                ? 'ring-2 ring-primary bg-primary/5' 
                : 'hover:shadow-md'
            }`}
            onClick={() => onSelect(profile.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Switch
                    checked={profile.enabled}
                    onCheckedChange={(checked) => handleToggleProfile(profile.id, checked)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div>
                    <CardTitle className="text-base">{profile.name}</CardTitle>
                    {profile.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {profile.description}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">
                    {profile.rules.length} 个规则
                  </span>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onEdit(profile.id)
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    {profile.id !== 'default' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(profile.id)
                        }}
                        className={showDeleteConfirm === profile.id ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            
            {showDeleteConfirm === profile.id && (
              <CardContent className="pt-0">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-700 mb-2">
                    确定要删除配置档案 "{profile.name}" 吗？此操作不可撤销。
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(profile.id)
                      }}
                    >
                      确认删除
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        cancelDelete()
                      }}
                    >
                      取消
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}

            {profile.rules.length > 0 && (
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="text-sm font-medium">规则列表:</div>
                  <div className="space-y-1">
                    {profile.rules.slice(0, 3).map((rule) => (
                      <div key={rule.id} className="flex items-center justify-between text-sm">
                        <span className={`${rule.enabled ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {rule.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {rule.type === 'request' ? '请求' : '响应'} • {rule.headers.length} 个头
                        </span>
                      </div>
                    ))}
                    {profile.rules.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        还有 {profile.rules.length - 3} 个规则...
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {profiles.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">暂无配置档案</h3>
            <p className="text-muted-foreground mb-4">
              创建您的第一个配置档案来开始使用ModHeaders
            </p>
            <Button onClick={onCreate}>
              <Plus className="w-4 h-4 mr-2" />
              创建配置档案
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
