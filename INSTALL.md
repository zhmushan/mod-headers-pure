# ModHeaders Modern 安装指南

## 🚀 快速安装

### 1. 构建项目
```bash
npm install
npm run build
```

### 2. 在Chrome中安装
1. 打开Chrome浏览器
2. 访问 `chrome://extensions/`
3. 启用右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择项目根目录下的 `dist` 文件夹
6. 插件安装完成！

## 📁 项目结构

```
mod_headers/
├── src/                    # 源代码
│   ├── components/         # React组件
│   │   ├── ui/            # 基础UI组件
│   │   └── features/      # 功能组件
│   ├── stores/            # 状态管理
│   ├── types/             # TypeScript类型
│   ├── lib/               # 工具函数
│   ├── styles/            # 样式文件
│   ├── background.ts      # 后台脚本
│   ├── content.ts         # 内容脚本
│   ├── popup.tsx          # 弹窗页面
│   ├── options.tsx        # 选项页面
│   └── manifest.json      # 插件清单
├── dist/                  # 构建输出
├── package.json           # 项目配置
├── vite.config.ts         # Vite配置
├── tailwind.config.js     # Tailwind配置
└── README.md              # 项目说明
```

## 🛠️ 开发命令

```bash
# 安装依赖
npm install

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

## ✨ 主要特性

- 🎨 **现代化UI**: 基于Radix UI和Tailwind CSS
- 🔧 **灵活配置**: 支持多个配置档案和规则管理
- 🛡️ **类型安全**: 完整的TypeScript类型定义
- 📱 **响应式设计**: 适配不同屏幕尺寸
- 🌙 **主题支持**: 支持浅色/深色主题
- 🔄 **实时同步**: 配置变更实时生效

## 🔧 使用说明

1. **创建配置档案**: 点击"新建档案"创建新的配置档案
2. **添加规则**: 在规则管理中添加HTTP头修改规则
3. **配置URL模式**: 设置规则适用的URL模式
4. **管理HTTP头**: 添加、修改或删除HTTP头

## 🐛 故障排除

### 常见问题

1. **插件无法加载**
   - 检查Chrome版本是否支持Manifest V3
   - 确认已启用开发者模式

2. **规则不生效**
   - 检查规则是否已启用
   - 确认URL模式是否正确
   - 查看浏览器控制台是否有错误

3. **构建失败**
   - 确保Node.js版本 >= 16
   - 删除node_modules重新安装依赖
   - 检查TypeScript错误

## 📞 技术支持

如有问题，请查看：
- README.md 详细文档
- 浏览器控制台错误信息
- GitHub Issues

---

**注意**: 本插件仅用于合法的开发和测试目的。请遵守相关法律法规和网站使用条款。
