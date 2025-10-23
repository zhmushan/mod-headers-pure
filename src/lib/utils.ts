import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 生成唯一ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

// 验证URL模式
export function isValidUrlPattern(pattern: string): boolean {
  try {
    // 简单的URL模式验证
    if (pattern === '<all_urls>' || pattern === '*') {
      return true
    }
    
    // 检查是否包含通配符
    if (pattern.includes('*')) {
      // 验证通配符位置是否合理
      const parts = pattern.split('*')
      if (parts.length > 2) return false
      
      // 检查协议部分
      if (parts[0] && !parts[0].match(/^https?:\/\//)) {
        return false
      }
    }
    
    // 尝试创建URL对象（对于完整URL）
    if (!pattern.includes('*')) {
      new URL(pattern)
    }
    
    return true
  } catch {
    return false
  }
}

// 验证HTTP头名称
export function isValidHeaderName(name: string): boolean {
  // HTTP头名称不能为空，且只能包含特定字符
  if (!name || name.trim().length === 0) return false
  
  // 检查是否包含非法字符
  const invalidChars = /[^\x21-\x7E]/
  if (invalidChars.test(name)) return false
  
  return true
}

// 验证HTTP头值
export function isValidHeaderValue(value: string): boolean {
  // HTTP头值不能包含控制字符（除了制表符和空格）
  const invalidChars = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/
  return !invalidChars.test(value)
}

// 格式化时间戳
export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 格式化文件大小
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 深拷贝对象
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as unknown as T
  if (typeof obj === 'object') {
    const clonedObj = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  return obj
}

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// 节流函数
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// 检查是否为Chrome扩展环境
export function isChromeExtension(): boolean {
  return typeof chrome !== 'undefined' && !!(chrome.runtime && chrome.runtime.id)
}

// 安全的JSON解析
export function safeJsonParse<T>(json: string, defaultValue: T): T {
  try {
    return JSON.parse(json)
  } catch {
    return defaultValue
  }
}

// 安全的JSON字符串化
export function safeJsonStringify(obj: any): string {
  try {
    return JSON.stringify(obj, null, 2)
  } catch {
    return '{}'
  }
}
