# .gitignore 配置说明

## 📁 忽略的文件和目录

### 依赖和包管理
- `node_modules/` - npm依赖包目录
- `npm-debug.log*` - npm调试日志
- `yarn-debug.log*` - yarn调试日志
- `pnpm-debug.log*` - pnpm调试日志
- `package-lock.json` - 已注释，可根据团队需要决定是否提交

### 构建输出
- `dist/` - Vite构建输出目录
- `build/` - 备用构建目录
- `*.tsbuildinfo` - TypeScript构建信息文件

### 环境配置
- `.env*` - 环境变量文件
- `.vscode/` - VS Code配置
- `.idea/` - IntelliJ IDEA配置

### 系统文件
- `.DS_Store` - macOS系统文件
- `Thumbs.db` - Windows缩略图文件
- `*.log` - 各种日志文件

### Chrome扩展特定
- `*.crx` - Chrome扩展包文件
- `*.pem` - 扩展签名文件
- `*.zip` - 扩展打包文件

### 重复文件
- `options.html` - 根目录的重复文件（实际文件在src/目录）
- `popup.html` - 根目录的重复文件（实际文件在src/目录）

## 🎯 配置原则

1. **安全性**: 忽略包含敏感信息的文件（如.env）
2. **性能**: 忽略大型依赖目录（如node_modules）
3. **清洁性**: 忽略构建输出和临时文件
4. **一致性**: 忽略IDE和系统生成的文件

## 📋 建议

- 定期检查.gitignore文件，确保没有遗漏重要文件
- 团队协作时，确保所有成员使用相同的.gitignore配置
- 对于package-lock.json，建议团队统一决定是否提交

---

这个.gitignore配置确保了仓库的清洁性和安全性，只包含源代码和必要的配置文件。
