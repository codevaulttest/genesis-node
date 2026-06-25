# genesis-node — Agent 规范

## 设计系统真源（按优先级）

| 层级 | 文件 | 内容 |
|---|---|---|
| 语义规格 | `DESIGN.md` | 色彩角色、排版层级、组件命名、Do's & Don'ts |
| Token 定义 | `src/design-tokens.css` | 所有 `--colors-*`、`--spacing-*`、`--rounded-*`、`--font-*`、`--shadow-*`、`--layout-*` |
| 组件样式 | `src/styles.css` | 已实现的可复用 CSS class |

**在这三份文件里查，不要凭记忆猜 token 名或复制旧值。**

---

## 工作流程

1. 先查 `DESIGN.md` 确认组件/模式是否已定义
2. 再查 `src/styles.css` 是否已有可复用 class
3. 样式值一律用 `design-tokens.css` 中的 CSS 变量
4. Token 不够用时，**先**在 `design-tokens.css` 新增（值须与 `DESIGN.md` 语义一致），**再**在 `styles.css` 使用

---

## 强制规则

- **禁止**硬编码颜色、间距、字体名、圆角、阴影（插画资产造型色除外）
- **禁止**使用 `--ku-*` 或父目录 token；本项目是 Coinbase Blue 色系，与 `knowledge-universe/` 完全独立
- **禁止**自创新 token 不经 `design-tokens.css` 声明就直接用
- **禁止**自绘 SVG `<path>`；图标使用已安装的 **Lucide React**，禁止引入其他图标库
- **禁止**重复实现 `DESIGN.md` 已定义的组件
- 链上交互（viem、钱包连接、合约调用）允许；UI 状态（加载、空态、错误、交易确认）须完整覆盖
- **禁止**擅自编造业务限制文案（费用、名额、风控规则须有据可查）
- Demo 模式（`DEMO_MODE` / `DevPanel`）仅用于本地预览，不影响正式 UI 规范

---

## 变更自检

- [ ] 颜色、间距、圆角、字体均来自 `design-tokens.css`
- [ ] 已对照 `DESIGN.md` 相关组件/Do's & Don'ts
- [ ] 优先复用 `styles.css` 已有 class
- [ ] 图标来自 Lucide React
- [ ] 数字/地址使用 `--font-mono`
