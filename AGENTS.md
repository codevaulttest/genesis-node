# 创世节点（genesis-node）— Agent 规范

本文件约束在 `genesis-node/` 目录下生成或修改 UI、样式与交互的所有行为。

---

## 设计系统层级

按优先级遵循以下三层，**不得跳过或违背上层规范**：

| 层级 | 文件 | 职责 |
|---|---|---|
| 设计规格 | `DESIGN.md` | Coinbase 风格设计系统的语义定义：颜色角色、排版层级、组件命名、圆角/间距哲学、Do's & Don'ts |
| Token 真源 | `src/design-tokens.css` | 所有 `--colors-*`、`--spacing-*`、`--rounded-*`、`--font-*`、`--shadow-*`、`--layout-*` 的唯一定义处 |
| 组件样式 | `src/styles.css` | 将 `DESIGN.md` 中的组件名映射为可复用 CSS class；页面级布局与项目特有组件 |

**工作流程：**

1. 动手前先查 `DESIGN.md` 对应组件/模式是否已定义
2. 查 `src/styles.css` 是否已有同名或等价 class 可复用
3. 样式值一律通过 `design-tokens.css` 中的 CSS 变量引用
4. Token 不够用时，**先**在 `design-tokens.css` 新增（值须与 `DESIGN.md` 语义一致），**再**在 `styles.css` 使用

`styles.css` 顶部已 `@import './design-tokens.css'`，新增 CSS 文件无需重复引入。

---

## 品牌与色系

本项目采用 **Coinbase 风格设计系统**（Coinbase Blue `#0052ff`），与父目录 `knowledge-universe/` 的 Mint/Teal（`--ku-*`）**完全独立**。

- **禁止**使用 `--ku-*` 或 CodeVAULT 主 App 的 `--color-primary` 等 token
- **禁止**自创新颜色；现有 token 不足时，先在 `design-tokens.css` 新增，再使用
- **禁止**在组件或样式中硬编码颜色、字体名、间距数值、圆角、阴影（插画资产见下文例外）
- `{colors.primary}` 仅用于主 CTA、品牌强调、内联链接；交易绿/红（`semantic-up` / `semantic-down`）**仅作文字色**，不作按钮背景

### Token 速查

```css
/* 颜色 — 品牌 */
var(--colors-primary)          /* #0052ff Coinbase Blue */
var(--colors-primary-active)
var(--colors-primary-disabled)

/* 颜色 — 文本 */
var(--colors-ink)
var(--colors-body)
var(--colors-muted)
var(--colors-on-dark)
var(--colors-on-dark-soft)

/* 颜色 — 表面 */
var(--colors-canvas)           /* 白底 */
var(--colors-surface-strong)   /* 浅灰 elevation */
var(--colors-surface-dark)     /* #0a0b0d 深色 hero / header */
var(--colors-surface-dark-elevated)  /* 深色浮层卡片、暗色 chip */

/* 颜色 — 语义 */
var(--colors-semantic-up)      /* 涨/成功，文字色 */
var(--colors-semantic-down)    /* 跌/错误，文字色 */
var(--colors-accent-yellow)    /* 警示，极少使用 */

/* 圆角 */
var(--rounded-pill)   /* 100px — 所有 CTA、badge、chip */
var(--rounded-xl)     /* 24px — 卡片 */
var(--rounded-full)   /* 圆形图标底板 */

/* 间距 */
var(--spacing-xs) … var(--spacing-section)

/* 字体 */
var(--font-display)   /* Inter，display 标题 weight 400 */
var(--font-sans)      /* Inter，正文/按钮 */
var(--font-mono)      /* JetBrains Mono，地址/数字 */
```

完整定义见 `src/design-tokens.css`；语义说明见 `DESIGN.md` 的 Colors / Typography / Shapes 章节。

---

## 排版原则

遵循 `DESIGN.md` Typography 章节：

- **Display 标题 weight 400**，禁止加粗 display 层级
- Display 使用 `var(--font-display)`；正文/按钮使用 `var(--font-sans)`
- 地址、编号、金额等数字/等宽内容使用 `var(--font-mono)`
- 负 letter-spacing 仅用于大标题（见 `DESIGN.md` display 层级表）

---

## 组件复用

编写 UI 前必须先检查是否已有实现：

| DESIGN.md 组件名 | styles.css class | 用途 |
|---|---|---|
| `button-primary` | `.button-primary` | 主 CTA 药丸按钮 |
| `button-pill-cta` | `.button-pill-cta` | 大号主 CTA（56px） |
| `button-secondary-light` | `.button-secondary-light` | 浅灰次要按钮 |
| `button-tertiary-text` | `.button-tertiary-text` | 文字链接按钮 |
| `hero-band-dark` | `.hero-band-dark` | 深色 hero 区 |
| `product-ui-card-dark` | `.product-ui-card-dark` | 深色浮层数据卡 |
| `badge-pill` | `.badge-pill` / `.badge-pill--on-dark` | 小标签 |
| `top-nav-on-dark` | `.top-nav-light`（深色背景变体） | 顶栏；暗色底上用 `.nav-wallet-chip` |
| `legal-band` | `.legal-band` | 页脚法律条 |

**规则：**

- 优先复用已有 class，禁止重复实现同类组件
- 新组件命名与 `DESIGN.md` `components:` 块保持一致（kebab-case）
- 暗色表面上的 chip/badge 使用 `--on-dark` / `--surface-dark-elevated`，**禁止**在深色 header 上使用 `--surface-strong` 浅色底（刺眼）

---

## 布局与形状

- **移动端优先**：`--layout-max-width: 512px`，内容居中
- 页面左右边距：`var(--spacing-base)`（16px）
- CTA / badge / chip：`var(--rounded-pill)`
- 卡片 / 面板：`var(--rounded-xl)`
- 图标圆形底板：`var(--rounded-full)`
- 间距使用 spacing token，禁止魔法数字
- 深度靠 card-on-card 分层，**禁止**随意叠加阴影层级（系统仅 `--shadow-soft` 一档）

---

## 图标

- 使用已安装的 **Lucide React**（`lucide-react`）
- **禁止**自绘 SVG `<path>`
- **禁止**引入其他图标库或 CDN 图标

---

## 暗色 / 浅色表面对配

页面节奏遵循 `DESIGN.md`：白底区块 ↔ 浅灰 elevation ↔ 全宽深色 hero。

| 场景 | 背景 | 文本 | Chip / 次要按钮 |
|---|---|---|---|
| 浅色页面 | `--colors-canvas` | `--colors-ink` / `--colors-body` | `--colors-surface-strong` |
| 深色 hero / header | `--colors-surface-dark` | `--colors-on-dark` | `--colors-surface-dark-elevated` + `--colors-on-dark-soft` |

---

## 项目定位

创世节点是 **BSC 链上交互式 Web App**（viem + 钱包连接），与父目录纯 UI Demo 不同：

- 允许链上读取、钱包连接、合约交互
- UI 状态（加载、空态、错误、交易确认）须完整覆盖
- **禁止**擅自编造业务限制文案（费用、名额、风控规则须有据可查）
- Demo 模式（`DEMO_MODE` / `DevPanel`）仅用于本地预览，不改变正式 UI 的设计规范

---

## 插画资产例外

若颜色属于插画造型的一部分（改变会破坏造型），允许在 `styles.css` 中硬编码。  
**UI / 品牌决策**（背景、边框、文字、按钮）必须走 token。

---

## 禁止事项

- 硬编码 hex / px / font-family（token 与插画例外除外）
- 跨项目借用 `--ku-*` 或 CodeVAULT token
- 用 `semantic-up` / `semantic-down` 作按钮或大面积背景
- Display 标题使用 `font-weight: 700+`
- CTA 使用 `border-radius: 0` 或非 pill 圆角
- 重复实现 `DESIGN.md` 已有组件
- 引入 Font Awesome、Material Icons 等外部图标库

---

## 变更检查清单

提交 UI 改动前自检：

- [ ] 已对照 `DESIGN.md` 相关组件/Do's & Don'ts
- [ ] 所有颜色、间距、圆角、字体均来自 `design-tokens.css`
- [ ] 优先复用 `styles.css` 已有 class
- [ ] 暗色表面上未使用浅色 chip 背景
- [ ] 图标来自 Lucide React
- [ ] 数字/地址使用 `--font-mono`
