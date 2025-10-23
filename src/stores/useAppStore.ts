import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { AppState, AppActions, Profile, AppSettings } from '@/types'
import { generateId } from '@/lib/utils'

const defaultSettings: AppSettings = {
  theme: 'system',
  language: 'zh-CN',
  autoSave: true,
  showNotifications: true
}

const defaultProfile: Profile = {
  id: 'default',
  name: '默认配置',
  description: '默认的HTTP头修改配置',
  rules: [],
  enabled: true,
  createdAt: Date.now(),
  updatedAt: Date.now()
}

interface AppStore extends AppState, AppActions {}

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        // 初始状态
        profiles: [defaultProfile],
        activeProfile: 'default',
        settings: defaultSettings,
        isLoading: false,
        error: undefined,

        // 创建配置档案
        createProfile: (profileData) => {
          const newProfile: Profile = {
            ...profileData,
            id: generateId(),
            createdAt: Date.now(),
            updatedAt: Date.now()
          }
          
          set((state) => ({
            profiles: [...state.profiles, newProfile],
            activeProfile: newProfile.id
          }))
        },

        // 更新配置档案
        updateProfile: (id, updates) => {
          set((state) => ({
            profiles: state.profiles.map(profile =>
              profile.id === id
                ? { ...profile, ...updates, updatedAt: Date.now() }
                : profile
            )
          }))
        },

        // 删除配置档案
        deleteProfile: (id) => {
          set((state) => {
            const newProfiles = state.profiles.filter(profile => profile.id !== id)
            const newActiveProfile = state.activeProfile === id 
              ? (newProfiles[0]?.id || 'default')
              : state.activeProfile
            
            return {
              profiles: newProfiles,
              activeProfile: newActiveProfile
            }
          })
        },

        // 设置活动配置档案
        setActiveProfile: (id) => {
          set({ activeProfile: id })
        },

        // 更新设置
        updateSettings: (settings) => {
          set((state) => ({
            settings: { ...state.settings, ...settings }
          }))
        },

        // 加载数据
        loadData: async () => {
          set({ isLoading: true, error: undefined })
          
          try {
            if (typeof chrome !== 'undefined' && chrome.storage) {
              const result = await chrome.storage.local.get(['profiles', 'activeProfile', 'settings'])
              
              set({
                profiles: result.profiles || [defaultProfile],
                activeProfile: result.activeProfile || 'default',
                settings: { ...defaultSettings, ...result.settings },
                isLoading: false
              })
            } else {
              // 非Chrome环境，使用localStorage
              const profiles = JSON.parse(localStorage.getItem('modheaders_profiles') || '[]')
              const activeProfile = localStorage.getItem('modheaders_activeProfile') || 'default'
              const settings = JSON.parse(localStorage.getItem('modheaders_settings') || '{}')
              
              set({
                profiles: profiles.length > 0 ? profiles : [defaultProfile],
                activeProfile,
                settings: { ...defaultSettings, ...settings },
                isLoading: false
              })
            }
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : '加载数据失败',
              isLoading: false
            })
          }
        },

        // 保存数据
        saveData: async () => {
          const { profiles, activeProfile, settings } = get()
          
          try {
            if (typeof chrome !== 'undefined' && chrome.storage) {
              await chrome.storage.local.set({
                profiles,
                activeProfile,
                settings
              })
            } else {
              // 非Chrome环境，使用localStorage
              localStorage.setItem('modheaders_profiles', JSON.stringify(profiles))
              localStorage.setItem('modheaders_activeProfile', activeProfile || 'default')
              localStorage.setItem('modheaders_settings', JSON.stringify(settings))
            }
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : '保存数据失败'
            })
          }
        }
      }),
      {
        name: 'modheaders-store',
        partialize: (state) => ({
          profiles: state.profiles,
          activeProfile: state.activeProfile,
          settings: state.settings
        })
      }
    ),
    {
      name: 'modheaders-store'
    }
  )
)

// 选择器函数
export const useActiveProfile = () => useAppStore((state) => {
  return state.profiles.find(profile => profile.id === state.activeProfile)
})

export const useActiveRules = () => useAppStore((state) => {
  const activeProfile = state.profiles.find(profile => profile.id === state.activeProfile)
  return activeProfile?.rules.filter(rule => rule.enabled) || []
})

export const useProfileById = (id: string) => useAppStore((state) => {
  return state.profiles.find(profile => profile.id === id)
})
