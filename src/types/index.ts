// 核心类型定义
export interface HeaderRule {
  id: string
  name: string
  enabled: boolean
  type: 'request' | 'response'
  urlPattern: string
  headers: HeaderEntry[]
  createdAt: number
  updatedAt: number
}

export interface HeaderEntry {
  id: string
  name: string
  value: string
  enabled: boolean
  action: 'set' | 'remove' | 'modify'
}

export interface Profile {
  id: string
  name: string
  description?: string
  rules: HeaderRule[]
  enabled: boolean
  createdAt: number
  updatedAt: number
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  language: 'zh-CN' | 'en'
  autoSave: boolean
  showNotifications: boolean
  defaultProfile?: string
}

export interface RequestInfo {
  url: string
  method: string
  headers: Record<string, string>
  timestamp: number
  tabId?: number
}

export interface ResponseInfo {
  url: string
  status: number
  headers: Record<string, string>
  timestamp: number
  tabId?: number
}

// Chrome Extension API 类型扩展
export interface ChromeRuntimeMessage {
  type: string
  payload?: any
}

export interface StorageChange {
  newValue?: any
  oldValue?: any
}

// 组件 Props 类型
export interface HeaderRuleFormProps {
  rule?: HeaderRule
  onSave: (rule: HeaderRule) => void
  onCancel: () => void
}

export interface ProfileSelectorProps {
  profiles: Profile[]
  selectedProfile?: string
  onSelect: (profileId: string) => void
  onCreate: () => void
  onEdit: (profileId: string) => void
  onDelete: (profileId: string) => void
}

// 状态管理类型
export interface AppState {
  profiles: Profile[]
  activeProfile?: string
  settings: AppSettings
  isLoading: boolean
  error?: string
}

export interface AppActions {
  createProfile: (profile: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateProfile: (id: string, updates: Partial<Profile>) => void
  deleteProfile: (id: string) => void
  setActiveProfile: (id: string) => void
  updateSettings: (settings: Partial<AppSettings>) => void
  loadData: () => Promise<void>
  saveData: () => Promise<void>
}
