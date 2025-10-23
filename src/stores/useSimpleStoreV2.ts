import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

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
  isLoading: boolean
  
  // 操作
  setHeaders: (headers: HeaderItem[]) => void
  addHeader: (header: Omit<HeaderItem, 'id'>) => void
  updateHeader: (id: string, updates: Partial<HeaderItem>) => void
  removeHeader: (id: string) => void
  toggleHeader: (id: string) => void
  setEnabled: (enabled: boolean) => void
  setUrlPattern: (pattern: string) => void
  clearAll: () => void
  loadFromStorage: () => Promise<void>
  saveToStorage: () => Promise<void>
}

// 存储键名
const STORAGE_KEY = 'modheaders-pure-config'

// 存储操作函数
const storage = {
  async get(): Promise<any> {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        const result = await chrome.storage.local.get([STORAGE_KEY])
        return result[STORAGE_KEY] || null
      } else {
        const item = localStorage.getItem(STORAGE_KEY)
        return item ? JSON.parse(item) : null
      }
    } catch (error) {
      console.error('获取存储数据失败:', error)
      return null
    }
  },

  async set(data: any): Promise<void> {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        await chrome.storage.local.set({ [STORAGE_KEY]: data })
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      }
    } catch (error) {
      console.error('保存存储数据失败:', error)
    }
  },

  async remove(): Promise<void> {
    try {
      if (typeof chrome !== 'undefined' && chrome.storage) {
        await chrome.storage.local.remove([STORAGE_KEY])
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch (error) {
      console.error('删除存储数据失败:', error)
    }
  }
}

export const useSimpleStore = create<SimpleStore>()(
  devtools(
    (set, get) => ({
      // 初始状态
      headers: [],
      enabled: false,
      urlPattern: '<all_urls>',
      isLoading: false,

      // 设置所有头
      setHeaders: (headers) => {
        set({ headers })
        get().saveToStorage()
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
        get().saveToStorage()
      },

      // 更新头
      updateHeader: (id, updates) => {
        set((state) => ({
          headers: state.headers.map(header =>
            header.id === id ? { ...header, ...updates } : header
          )
        }))
        get().saveToStorage()
      },

      // 删除头
      removeHeader: (id) => {
        set((state) => ({
          headers: state.headers.filter(header => header.id !== id)
        }))
        get().saveToStorage()
      },

      // 切换头启用状态
      toggleHeader: (id) => {
        set((state) => ({
          headers: state.headers.map(header =>
            header.id === id ? { ...header, enabled: !header.enabled } : header
          )
        }))
        get().saveToStorage()
      },

      // 设置插件启用状态
      setEnabled: (enabled) => {
        set({ enabled })
        get().saveToStorage()
      },

      // 设置URL模式
      setUrlPattern: (urlPattern) => {
        set({ urlPattern })
        get().saveToStorage()
      },

      // 清除所有数据
      clearAll: () => {
        set({
          headers: [],
          enabled: false,
          urlPattern: '<all_urls>'
        })
        get().saveToStorage()
      },

      // 从存储加载数据
      loadFromStorage: async () => {
        set({ isLoading: true })
        try {
          const data = await storage.get()
          if (data) {
            set({
              headers: data.headers || [],
              enabled: data.enabled || false,
              urlPattern: data.urlPattern || '<all_urls>'
            })
          }
        } catch (error) {
          console.error('加载存储数据失败:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      // 保存数据到存储
      saveToStorage: async () => {
        const state = get()
        const data = {
          headers: state.headers,
          enabled: state.enabled,
          urlPattern: state.urlPattern,
          lastUpdated: Date.now()
        }
        await storage.set(data)
      }
    }),
    {
      name: 'modheaders-simple-store'
    }
  )
)
