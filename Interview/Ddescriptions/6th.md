# Slide 6: Dev Agent 实战演示

## 页面主题
**从 Skill + Knowledge → 完整开发工作流**

---

## 布局建议
**左右对比布局**：Default Agent vs Dev Agent

---

## 对比组 1：API 检索问题

### ❌ Default Agent
- 搜索代码找到 `GetAbilitySystemComponent`
- 直接使用 → **编译报错**（这是 Actor 成员函数）
- 再搜 `GetSelf` / `GetSelfActor` → 还是错
- **多次试错，效率低**

### ✅ Dev Agent
- 检索知识库
- 返回：「从外部 Actor 获取用 `GetAbilitySystemComponentFromActor`」
- **一次正确**

> 📸 截图建议：左边展示报错，右边展示知识库返回正确 API

---

## 对比组 2：开发流程问题

### ❌ Default Agent
- 生成代码**缺少标准结构**
- 没有生命周期函数
- **遗漏蓝图配置步骤**
- 需要反复问用户

### ✅ Dev Agent
- Skill 指导完整流程：
  1. 调用脚本生成框架
  2. 实现生命周期函数
  3. 提示用户配置蓝图
- **流程完整，不遗漏**

> 📸 截图建议：左边展示不完整代码，右边展示完整流程指引

---

## 关键差异总结表

| 维度 | Default Agent | Dev Agent |
|------|---------------|-----------|
| API 检索 | 猜测 → 多次试错 | 知识库 → 一次正确 |
| 开发模板 | 无 → 从零开始 | Skill → 框架自动生成 |
| 蓝图配置 | 遗漏步骤 | 流程完整，主动提示 |

---

## 核心结论

> **不是 Agent 变聪明了，是给它提供了正确的信息和流程。**

---

## 演讲要点（30秒）

1. **API 对比**（15秒）
   - 左边原生 Agent 用错 API，编译报错
   - 右边 Dev Agent 检索知识库，一次正确

2. **流程对比**（10秒）
   - 左边缺少结构，遗漏蓝图配置
   - 右边 Skill 指导完整流程

3. **总结**（5秒）
   - Skill + Knowledge = 正确的信息 + 正确的流程

---
