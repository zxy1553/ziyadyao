# Slide 4: Skill 能力扩展——从通用 Agent 到领域专家

## 页面标题
**Skill 矩阵：能力叠加架构**

---

## 核心架构图

```
顶层：Dev Skills + Debug Skills
      ↓ 叠加
底层：Base Agent (通用大模型能力)
```

**布局说明**：
- 底部：宽大的 Base Agent 基座（通用能力）
- 上方左侧：🔧 Dev Skills 模块
- 上方右侧：🐛 Debug Skills 模块

---

## 左侧模块：Dev Skills (开发效率)

### 痛点
- 脚本生成代码仅是空壳，大量重复逻辑需人工填充
- 蓝图修改受限，AI 无法直接操作

### 解决方案

| Skill 名称 | 功能 |
|-----------|------|
| GAS-AbleTask | 提供 Basic/SpawnActor/HitTask/AddCue 等多套模板 |
| Condition Writer | 内置专家知识，实时指导开发 |
| Status Writer | 替代晦涩文档，提供开发 SOP |

### 关键策略
> Agent 生成核心 Lua 代码 + 输出配置 SOP（人机协作）

---

## 右侧模块：Debug Skills (调试自动化)

### 痛点
- 手动从智研平台拉取日志，流程繁琐
- 日志文件体积过大，超出 Agent 上下文限制

### 解决方案

| Skill 名称 | 功能 |
|-----------|------|
| DS Log Dump | BattleID → 自动拉取 DS 日志（全自动化） |
| Log Split | 按 BattleID + 时间戳智能切分，每份 <10MB |

---

## 底部区域：阶段性反思

### ⚠️ 提效了，但人工介入仍多

**Dev 侧遗留问题**：
- API 混淆：混淆 `GetOwningPawn` / `GetSelfActor` / `GetActor`
- 根因：缺乏项目级 API 规范知识

**Debug 侧遗留问题**：
- 分析方向偏离：误判正常机制为异常
- 流程不固定：分析无关时间段、错误角色
- 根因：缺乏调用链知识和固定分析流程

### 💡 核心洞察
> **Skill 解决了"怎么做"，但 Agent 仍缺少"知道什么"**
> → 需要引入**知识库**

---

## 演讲要点
1. Base Agent 有通用能力，但缺乏领域深度
2. Dev Skills：模板化解决重复劳动，SOP 解决蓝图限制
3. Debug Skills：自动化脚本解决繁琐流程，切分工具突破大文件限制
4. 反思过渡：Skill 提效但人工介入仍多 → 引出知识库
