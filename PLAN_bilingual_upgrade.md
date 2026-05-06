# Wrijo 网站双语版升级计划
日期：2026-05-06
状态：待确认

---

## 一、项目目标

将 Wrijo 网站从纯中文升级为中英文双语版，统一视觉风格与 jobs-risk.html 保持一致。

---

## 二、配色方案（最终版）

```css
:root {
  --primary:        #0A5640;   /* 深绿 - 主色 */
  --primary-light:  #1A7A5E;   /* 浅绿 - hover态 */
  --accent:         #A88B3D;   /* 深金 - 强调色（WCAG AA通过）*/
  --accent-light:   #C9A84C;   /* 暖金 - 用于深色背景上 */
  --background:     #F8F6F0;  /* 暖白 - 全局背景 */
  --surface:        #FFFFFF;  /* 卡片白 */
  --text:           #1A1A1A;  /* 正文黑 */
  --text-muted:     #6B7280;  /* 次要文字 */
  --border:         #E5E1D8;  /* 分割线 */
  --font-sans:      'Outfit', system-ui, sans-serif;
}
```

**注意：金色 `#A88B3D` 只用于深色背景区域；浅色背景上的强调词改用深绿 `#0A5640`**

---

## 三、布局结构

```
┌─────────────────────────────────────────────────┐
│  HEADER                                          │
│  [语言切换按钮 中/EN]        Wrijo  AI写作工具箱  │
├─────────────────────────────────────────────────┤
│  HERO                                            │
│  h1: Wrijo - AI写作工具箱                         │
│  p:  简历 · 邮件 · 内容 · 面试                    │
│  [免费开始]  [查看定价]                           │
├─────────────────────────────────────────────────┤
│  TOOLS GRID (3列 → 2列 → 1列响应式)              │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐            │
│  │简历诊断  │ │需求助手  │ │面试助手  │            │
│  │Resume   │ │Prompts  │ │Interview│            │
│  └─────────┘ └─────────┘ └─────────┘            │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐            │
│  │LinkedIn │ │商英邮件  │ │内容改写  │            │
│  │Optimize │ │Biz Email│ │Rewriter │            │
│  └─────────┘ └─────────┘ └─────────┘            │
├─────────────────────────────────────────────────┤
│  FOOTER                                         │
│  Pricing · Privacy · Terms · GitHub             │
└─────────────────────────────────────────────────┘
```

语言切换：顶部按钮，点击切换 `data-lang="zh/en"`，纯前端 JS 实现。

---

## 四、翻译范围

| 位置 | 中文 | 英文 |
|------|------|------|
| 导航 slogan | AI写作工具箱 | AI Writing Toolkit |
| Hero h1 | Wrijo — AI写作工具箱 | Wrijo — AI Writing Toolkit |
| Hero p | 简历·邮件·内容·面试 | Resume · Email · Content · Interview |
| CTA 按钮 | 免费开始 | Start Free |
| CTA 按钮 | 查看定价 | View Pricing |
| 工具卡片（共6个） | 标题+描述 | 见下表 |

**工具卡片翻译对照：**

| 工具 | 中文标题 | 英文标题 | 中文描述 | 英文描述 |
|------|---------|---------|---------|---------|
| 1 | 简历诊断 | Resume Diagnoser | 分析简历问题，给出优化建议 | Analyze resume issues with actionable suggestions |
| 2 | 需求助手 | Prompt Assistant | 描述需求，生成精准提示词 | Describe your needs, generate precise prompts |
| 3 | 面试助手 | Interview Copilot | AI模拟面试，即时反馈 | AI mock interviews with instant feedback |
| 4 | LinkedIn优化 | LinkedIn Optimizer | 优化领英内容，提升曝光 | Optimize LinkedIn content for better visibility |
| 5 | 商英邮件 | Biz Email Writer | 专业英文邮件，一键生成 | Professional business emails, one-click generation |
| 6 | 内容改写 | Content Rewriter | 改写润色，提升可读性 | Rewrite and polish content for readability |

---

## 五、SEO 处理

- HTML 加 `<html lang="zh-CN">` + `<link rel="alternate" hreflang="en" href=".../en/">`
- 语言切换按钮加 `aria-label`
- 页面 `<title>` 和 `<meta name="description">` 随语言切换更新

---

## 六、动效规范

| 元素 | 动效 |
|------|------|
| 页面入口 | `400ms ease-out` [Y+20→0, opacity 0→1] |
| 卡片 hover | `150ms` [Y-2px, shadow加深] |
| 按钮按下 | `100ms` [scale 0.97→1] |
| 语言切换 | `200ms ease` 淡入淡出 |

---

## 七、改动文件清单

| 文件 | 改动内容 | 预计行数 |
|------|---------|---------|
| `index.html` | 全面重写：配色+双语+动效+SEO | ~350行 |
| `pricing.html` | 同步更新：双语+配色统一 | ~80行 |
| `index_old.html` | 保留备份 | — |

---

## 八、工作流程

```
① 读当前 index.html（了解现有结构）
② 备份 index.html → index_old.html
③ 重写 index.html（配色+双语+动效+SEO）
④ 重写 pricing.html（双语+配色统一）
⑤ 本地测试（浏览器打开检查）
⑥ 部署 Vercel
⑦ 验证：页面加载/语言切换/手机适配
```

---

## 九、验证清单

- [ ] 页面在 Chrome/Edge 正常加载
- [ ] 中/EN 切换正常，文字全部切换
- [ ] 手机端（320px）布局正常
- [ ] jobs-risk.html 风格与 index.html 一致
- [ ] Vercel 部署成功，无报错
- [ ] GitHub 提交记录正常

---

## 十、模型配置

- 使用 **DeepSeek-V4** 或 **Qwen-Max**（SiliconFlow 国产模型）
- 单次生成，一次成型，减少来回

---

## 十一、阻塞条件

无。先确认此计划 → 开始执行。
