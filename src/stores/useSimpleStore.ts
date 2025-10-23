import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface HeaderItem {
  id: string
  name: string
  value: string
  enabled: boolean
}

interface SimpleStore {
  // 状态
  headers: HeaderItem[]
  enabled: boolean
  urlPattern: string
  
  // 操作
  setHeaders: (headers: HeaderItem[]) => void
  addHeader: (header: Omit<HeaderItem, 'id'>) => void
  updateHeader: (id: string, updates: Partial<HeaderItem>) => void
  removeHeader: (id: string) => void
  toggleHeader: (id: string) => void
  setEnabled: (enabled: boolean) => void
  setUrlPattern: (pattern: string) => void
  clearAll: () => void
}

export const useSimpleStore = create<SimpleStore>()(
  devtools(
    persist(
      (set, _get) => ({
        // 初始状态
        headers: [],
        enabled: false,
        urlPattern: '<all_urls>',

        // 设置所有头
        setHeaders: (headers) => {
          set({ headers })
        },

        // 添加头
        addHeader: (header) => {
          const newHeader: HeaderItem = {
            ...header,
            id: Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
          }
          set((state) => ({
            headers: [...state.headers, newHeader]
          }))
        },

        // 更新头
        updateHeader: (id, updates) => {
          set((state) => ({
            headers: state.headers.map(header =>
              header.id === id ? { ...header, ...updates } : header
            )
          }))
        },

        // 删除头
        removeHeader: (id) => {
          set((state) => ({
            headers: state.headers.filter(header => header.id !== id)
          }))
        },

        // 切换头启用状态
        toggleHeader: (id) => {
          set((state) => ({
            headers: state.headers.map(header =>
              header.id === id ? { ...header, enabled: !header.enabled } : header
            )
          }))
        },

        // 设置插件启用状态
        setEnabled: (enabled) => {
          set({ enabled })
        },

        // 设置URL模式
        setUrlPattern: (urlPattern) => {
          set({ urlPattern })
        },

        // 清除所有数据
        clearAll: () => {
          set({
            headers: [],
            enabled: false,
            urlPattern: '<all_urls>'
          })
        }
      }),
      {
        name: 'modheaders-simple-store',
        storage: {
          getItem: (name) => {
            try {
              if (typeof chrome !== 'undefined' && chrome.storage) {
                // Chrome扩展环境 - 使用同步方式
                const result = chrome.storage.local.get([name]) as any
                return result[name] || null
              } else {
                // 普通浏览器环境
                const item = localStorage.getItem(name)
                return item ? JSON.parse(item) : null
              }
            } catch (error) {
              console.error('获取存储数据失败:', error)
              return null
            }
          },
          setItem: (name, value) => {
            try {
              if (typeof chrome !== 'undefined' && chrome.storage) {
                // Chrome扩展环境
                chrome.storage.local.set({ [name]: value })
              } else {
                // 普通浏览器环境
                localStorage.setItem(name, JSON.stringify(value))
              }
            } catch (error) {
              console.error('保存存储数据失败:', error)
            }
          },
          removeItem: (name) => {
            try {
              if (typeof chrome !== 'undefined' && chrome.storage) {
                // Chrome扩展环境
                chrome.storage.local.remove([name])
              } else {
                // 普通浏览器环境
                localStorage.removeItem(name)
              }
            } catch (error) {
              console.error('删除存储数据失败:', error)
            }
          }
        }
      }
    ),
    {
      name: 'modheaders-simple-store'
    }
  )
)
