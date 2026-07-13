# AI 落地页生成器

选择行业，AI 自动生成可用于接单的商业官网。

## 功能

- 🤖 **AI 智能生成** — 基于 DeepSeek 大模型，输入行业秒级生成专业商业文案
- 🎨 **5 套配色主题** — 经典灰、海洋蓝、暖阳橙、浪漫粉、森林绿
- ✏️ **全功能在线编辑器** — 自由修改文字、上传图片、增删模块
- 📋 **自定义表单字段** — 姓名、电话、邮箱等字段自由配置
- 🖼️ **作品展示图集** — 支持多组图集，每张图可加说明文字
- 📝 **自定义模块** — 自由添加标题+内容段落
- 🔗 **公开分享链接** — 每个商家独享 `/p/[id]` 短链接
- 📱 **二维码** — 浏览器内生成，无需外部 API
- 💬 **悬浮联系按钮** — 访客随时点击咨询
- 📄 **导出 HTML** — 下载独立文件，可自行部署
- ⚡ **AI 写作助手** — 编辑器中直接对话 AI，按需生成文案
- 🛡️ **速率限制** — 内置 IP 限流，保护 API 使用

## 技术栈

| 技术 | 用途 |
|------|------|
| Next.js 14 (App Router) | 前端框架 |
| TypeScript | 类型安全 |
| Tailwind CSS | 样式 |
| DeepSeek API | AI 文案生成 |
| qrcode | 二维码生成 |
| pnpm | 包管理 |

## 快速开始

### 前置要求

- Node.js 18+
- pnpm（推荐）或 npm
- DeepSeek API 密钥（[去申请](https://platform.deepseek.com/)）

### 安装

```bash
# 1. 克隆项目
git clone https://github.com/你的用户名/ai-landing-page.git
cd ai-landing-page

# 2. 安装依赖
pnpm install

# 3. 配置环境变量
# 复制 .env.example 为 .env.local，填入你的 DeepSeek API 密钥
# .env.local 已加入 .gitignore，不会提交到 GitHub
DEEPSEEK_API_KEY=sk-your_key_here

# 4. 启动开发服务器
pnpm run dev
```

访问 `http://localhost:3000`

## 部署到 Vercel（推荐）

```bash
# 1. 推送代码到 GitHub
git remote add origin https://github.com/你的用户名/ai-landing-page.git
git push -u origin master

# 2. 打开 https://vercel.com
# 3. 点击 "Add New" → "Project"
# 4. 选择刚推送的仓库
# 5. 在 "Environment Variables" 中设置：
#    名称: DEEPSEEK_API_KEY
#    值: 你的 DeepSeek API 密钥
# 6. 点击 "Deploy"

# 部署完成后获得公网域名：
# https://ai-landing-page.vercel.app
```

## 使用流程

```
商家访问 → 选择行业 → AI 生成官网文案
    ↓
进入编辑页 → 修改文字/上传图片/增删模块/切换配色
    ↓
获得公开链接 `/p/a1b2c3` + 二维码
    ↓
将链接/二维码发给客户 → 客户查看作品和联系方式
    ↓
客户填写咨询表单 → 商家收到询盘
```

## 项目结构

```
ai-landing-page/
├── app/
│   ├── api/
│   │   ├── generate/           # AI 生成文案
│   │   ├── generate-section/   # 分节 AI 生成
│   │   ├── pages/              # 页面存储 CRUD
│   │   └── contact/            # 咨询提交
│   ├── components/
│   │   ├── landing-page.tsx    # 落地页渲染组件
│   │   └── page-editor.tsx     # 页面编辑器组件
│   ├── lib/
│   │   ├── store.ts            # 内存页面存储
│   │   └── rate-limit.ts       # 速率限制
│   ├── p/[id]/page.tsx         # 公开页面
│   ├── result/page.tsx         # 结果管理页
│   └── page.tsx                # 首页
├── .env.example                # 环境变量模板
├── .gitignore
├── package.json
└── README.md
```

## 安全说明

- **API 密钥安全**：密钥存储在服务端环境变量，不会发送到浏览器
- **速率限制**：内置 IP 限流（20次/小时），防止 API 被滥用
- **隐私保护**：`.env.local` 已加入 `.gitignore`，不会提交到 GitHub
- **数据存储**：当前使用内存存储（服务重启后数据丢失），生产环境建议接入数据库

## 许可

MIT