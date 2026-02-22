# 📝 Web2MD - 网页转 Markdown 浏览器扩展

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Manifest](https://img.shields.io/badge/Manifest-V3-orange.svg)

**一键将任意网页转换为格式规范的 Markdown 文档**

[功能特性](#功能特性) • [快速开始](#快速开始) • [使用指南](#使用指南) • [贡献指南](#贡献指南)

------

## 📖 项目简介

Web2MD 是一款基于 **Manifest V3** 的浏览器扩展，能够将任意网页内容智能转换为格式规范、排版整洁的 Markdown 文档。内置 **Markdown 语法校验与自动修复（尚未实现）** 功能，确保输出的文档符合最佳实践标准。

### 🎯 适用场景

| 场景           | 说明                                   |
| -------------- | -------------------------------------- |
| 📚 技术文章收藏 | 将博客、教程保存为本地 Markdown 文档   |
| 📰 新闻归档     | 保存新闻文章，便于离线阅读和整理       |
| 📝 内容创作     | 快速提取网页内容作为写作素材           |
| 🔍 知识管理     | 整合到 Obsidian、Notion 等知识管理工具 |
| 📦 数据备份     | 批量保存重要网页内容                   |

------

<h2 id="功能特性">✨ 功能特性</h2>

### 🏆 核心功能 

| 功能               | 描述                                                         |
| ------------------ | ------------------------------------------------------------ |
| 🔄 **智能转换**     | 自动识别文章主体，移除导航、广告等干扰元素 **（并不会）**     |
| 📋 **一键复制**     | 转换后直接复制到剪贴板                                       |
| 💾 **文件下载**     | 支持自定义文件名，保存为 .md 文件                            |
| 📄 **Front Matter** | 自动生成标题、日期、URL 等元数据                             |
| 🖱️ **右键菜单**     | 选中文字后右键快速转换为 Markdown **（实际体验与直接复制一致）** |

### 🛡️ 高级功能 (待做)

------

## 🛠️ 技术栈

```
├── 框架          React 18 + TypeScript
├── 构建工具      Vite + CRXJS
├── 转换引擎      Turndown (HTML → Markdown)
├── 校验引擎      markdownlint (语法检查)
├── 浏览器 API    Manifest V3
└── 包管理        npm
```

### 项目结构

```
web2md-extension/
├── assets/              # 图标等资源文件
├── background/          # Service Worker 后台脚本
├── content/             # 内容脚本 (页面转换逻辑)
├── popup/               # 弹出面板 UI
│   ├── index.html
│   ├── main.tsx
│   ├── Popup.tsx
│   └── index.css
├── manifest.json        # 扩展配置文件
├── vite.config.ts           # Vite 配置
├── tsconfig.json            # TypeScript 配置
├── package.json             # 项目依赖
└── README.md                # 项目文档
```

------

<h2 id="快速开始">🚀 快速开始</h2>

### 测试验证环境

- Node.js == 20.0
- npm == 10.8.2
- Chrome浏览器 == 145.0.7632.76

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/aqzl1/web2md-extension.git
cd web2md-extension

# 安装依赖
npm install
```

### 开发模式

```bash
# 启动开发服务器 (支持热更新)
npm run dev
```

### 构建生产版本

```bash
# 构建扩展
npm run build
```

构建产物将输出到 `dist/` 目录。

------

<h2 id="使用指南">📖 使用指南</h2>

### 安装方式：

1. 打开谷歌浏览器，地址栏中输入 `chrome://extensions/`

2. 打开右上角的 **开发者模式**

3. 将构建完成的 `dist/` 目录拖拽到当前页面即可完成安装

### 使用方式一：弹窗转换

1. 打开任意网页
2. 点击浏览器工具栏的 **Web2MD 图标**
3. 点击 **「转换当前页面」** 按钮
4. 等待转换完成后，选择 **复制** 、 **下载** 或 **预览**

### 使用方式二：右键菜单

1. 在网页中 **选中** 想要转换的文字
2. **右键点击** 选中的内容
3. 选择 **「转换为 Markdown (Web2MD)」**
4. 内容自动复制到剪贴板并显示通知

------

## 🧪 测试指南

### 手动测试清单

| 测试项   | 操作步骤               | 预期结果          |
| -------- | ---------------------- | ----------------- |
| 基础转换 | 打开博客文章，点击转换 | 成功生成 Markdown |
| 复制功能 | 转换后点击复制         | 内容进入剪贴板    |
| 下载功能 | 转换后点击下载         | 弹出保存对话框    |
| 右键菜单 | 选中文字后右键         | 显示转换选项      |

### 推荐测试网站

```
- https://zhuanlan.zhihu.com/          (知乎专栏)
- https://juejin.cn/                    (掘金)
- https://medium.com/                   (Medium)
- https://www.cnblogs.com/              (博客园)
- https://github.com/                   (GitHub README)
```

------

<h2 id="贡献指南">🤝 贡献指南</h2>

欢迎贡献代码！请遵循以下流程：

### 1. Fork 项目

```bash
# 点击 GitHub 页面上的 Fork 按钮
```

### 2. 克隆本地

```bash
git clone https://github.com/aqzl1/web2md-extension.git
cd web2md-extension
```

### 3. 创建分支

```bash
# 功能开发
git checkout -b feature/your-feature-name

# Bug 修复
git checkout -b fix/your-bug-fix
```

### 4. 提交代码

```bash
# 提交时请遵循规范
git commit -m "feat: 添加新功能"
git commit -m "fix: 修复某个问题"
git commit -m "docs: 更新文档"
```

### 5. 提交 PR

```bash
# 推送到远程
git push origin feature/your-feature-name

# 在 GitHub 上创建 Pull Request
```

### 代码规范

- 使用 **TypeScript** 编写代码
- 遵循 **ESLint** 规则
- 组件使用 **React Hooks**
- 样式使用 **CSS 变量** 保持主题一致

------

## 📄 许可证

本项目采用 **MIT 许可证**，详见 [LICENSE](https://www.qianwen.com/chat/LICENSE) 文件。

```
Copyright (c) 2026 Web2MD Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

------

## 🙏 致谢

感谢以下开源项目：

- **[Turndown](https://github.com/mixmark-io/turndown)** - HTML 转 Markdown 引擎
- **[markdownlint](https://github.com/DavidAnson/markdownlint)** - Markdown 语法检查工具
- **[CRXJS](https://crxjs.dev/vite-plugin)** - Vite 浏览器扩展插件
- **[webextension-polyfill](https://github.com/mozilla/webextension-polyfill)** - 浏览器 API 兼容层

------

**如果这个项目对你有帮助，请给个 ⭐ Star 支持一下！**

Made with ❤️ by Qwen3.5-Plus
