# ModHeaders Pure

一个纯净的HTTP头修改Chrome插件，使用TypeScript、React和现代Web技术构建。

## ⚠️ 项目背景

**重要说明**: 本项目是因为原版ModHeaders插件在最新版本中注入了恶意代码而创建的替代方案。

原版ModHeaders插件曾经是一个优秀的HTTP头修改工具，但在最近的更新中，开发者注入了恶意代码，可能对用户的数据安全和隐私造成威胁。为了提供一个安全、可靠的替代方案，我们使用现代Web技术重新实现了这个功能。

## 🤖 项目制作

本项目完全由 **Cursor AI** 协助开发完成，展示了AI辅助编程的强大能力：

- 🧠 **智能架构设计**: AI帮助设计了现代化的插件架构
- 💻 **代码生成**: 使用TypeScript + React + Vite技术栈
- 🎨 **UI设计**: 基于Radix UI和Tailwind CSS的现代化界面
- 🔧 **功能实现**: 完整的HTTP头修改功能
- 🐛 **问题修复**: AI协助解决了各种技术问题

这证明了AI工具在软件开发中的巨大潜力，能够在短时间内创建出高质量、功能完整的应用程序。

## ✨ 特性

- 🛡️ **安全可靠**: 开源代码，无恶意代码，完全透明
- 🚀 **纯净架构**: 使用TypeScript + React + Vite构建
- 🎨 **美观界面**: 基于Radix UI和Tailwind CSS的现代化UI
- 🔧 **简化配置**: 直观的表格形式管理HTTP头
- 🛡️ **类型安全**: 完整的TypeScript类型定义
- 📱 **响应式设计**: 适配不同屏幕尺寸
- 🔄 **实时同步**: 配置变更实时生效
- 📊 **状态监控**: 实时显示插件状态和活动规则
- 🤖 **AI制作**: 完全由Cursor AI协助开发，展示AI编程能力

## 🏗️ 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **UI组件**: Radix UI + Tailwind CSS
- **状态管理**: Zustand
- **图标**: Lucide React
- **代码质量**: ESLint + TypeScript

## 📦 安装

### 开发环境

1. 克隆仓库
```bash
git clone <repository-url>
cd mod-headers
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 构建生产版本
```bash
npm run build
```

### Chrome插件安装

1. 构建项目
```bash
npm run build
```

2. 打开Chrome扩展管理页面 (`chrome://extensions/`)

3. 启用"开发者模式"

4. 点击"加载已解压的扩展程序"

5. 选择 `dist` 目录

## 🚀 使用指南

### 基本功能

1. **启用插件**: 切换"启用插件"开关控制是否应用HTTP头修改
2. **设置URL模式**: 配置规则适用的URL模式（如 `<all_urls>` 或 `https://example.com/*`）
3. **管理HTTP头**: 使用简洁的表格形式添加、编辑或删除HTTP头
4. **实时生效**: 配置更改后立即生效，无需刷新页面

### 简化界面

- **表格形式**: 每个HTTP头独占一行，包含启用状态、名称和值
- **直观操作**: 复选框控制启用/禁用，输入框编辑内容
- **一键添加**: 点击"添加头"按钮快速添加新的HTTP头配置

### URL模式

支持以下URL模式格式：
- `<all_urls>`: 匹配所有URL
- `https://example.com/*`: 匹配特定域名下的所有路径
- `https://example.com/api/*`: 匹配特定路径下的所有URL

### HTTP头管理

- **启用/禁用**: 使用复选框控制每个HTTP头是否生效
- **名称编辑**: 直接编辑HTTP头名称
- **值编辑**: 直接编辑HTTP头值
- **删除操作**: 点击删除按钮移除不需要的HTTP头

## 🛠️ 开发

### 项目结构

```
src/
├── components/          # React组件
│   ├── ui/             # 基础UI组件 (Button, Input, Switch等)
│   └── features/       # 功能组件 (SimpleHeaderManager等)
├── stores/             # 状态管理 (useSimpleStoreV2)
├── types/              # TypeScript类型定义
├── lib/                # 工具函数 (utils.ts)
├── styles/             # 样式文件 (globals.css, content.css)
├── background.ts       # 后台脚本 (使用declarativeNetRequest API)
├── content.ts          # 内容脚本 (网络请求监控)
├── popup-simple.tsx    # 简化弹窗页面
├── options.tsx         # 选项页面
├── popup.html          # 弹窗HTML
├── options.html        # 选项HTML
└── manifest.json       # 插件清单 (Manifest V3)
```

### 开发命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 修复代码问题
npm run lint:fix
```

### 代码规范

- 使用TypeScript进行类型检查
- 遵循ESLint规则
- 使用Prettier格式化代码
- 组件使用函数式组件和Hooks
- 使用Tailwind CSS进行样式设计

## 🔧 配置

### 插件设置

- **主题**: 选择浅色、深色或跟随系统
- **语言**: 支持中文和英文
- **自动保存**: 自动保存配置更改
- **通知**: 显示插件操作通知

### 数据管理

- **导出配置**: 导出所有配置到JSON文件
- **导入配置**: 从JSON文件导入配置
- **清除数据**: 清除所有配置数据

## 🐛 故障排除

### 常见问题

1. **插件无法加载**
   - 检查Chrome版本是否支持Manifest V3
   - 确认已启用开发者模式

2. **规则不生效**
   - 检查规则是否已启用
   - 确认URL模式是否正确
   - 查看浏览器控制台是否有错误

3. **配置丢失**
   - 检查Chrome存储权限
   - 尝试重新导入配置

### 调试

1. 打开Chrome开发者工具
2. 查看Console标签页的错误信息
3. 检查Network标签页的请求头
4. 使用Chrome扩展调试工具

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！这个项目展示了AI辅助编程的能力，也欢迎讨论AI在软件开发中的应用。

## 📞 支持

如有问题，请通过以下方式联系：
- 提交GitHub Issue
- 查看项目文档和故障排除指南

## 🎯 项目亮点

- **安全性**: 完全开源，无恶意代码，代码透明可审查
- **纯净性**: 使用最新的Web技术栈和最佳实践
- **AI制作**: 展示Cursor AI在软件开发中的强大能力
- **用户友好**: 简化的界面设计，易于使用和维护

---

**重要提醒**: 
- 本插件仅用于合法的开发和测试目的
- 请遵守相关法律法规和网站使用条款
- 这是原版ModHeaders的安全替代方案，建议卸载原版插件
- 项目完全由AI协助开发，展示了AI编程的巨大潜力
