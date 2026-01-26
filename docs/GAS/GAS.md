

技能管理器
技能遵循“先学后放”
giveability
tryactivateabilityby****
ASC 维护两个数组
- FGamplayAbilitySpec 该结构体通过一个指针指向 GA 的 CDO

GE 是纯数据类，不可编程
- 用于修改jueseshuxing
- 标签控制
- 配置 GC，播放视觉或声音效果
本质是 带有时间属性的状态修改
- Duration Policy
    - Instant 立即执行一次
    - Has Duration 一段时间添加效果
    - Infinite 永久添加
- Period 一定时间间隔执行一次
Duration Policy 和 Period 配合

***Instant 直接修改属性，无法移除
Infinite 可以在未来手动移除，只是无法通过 Timer 自动移除***

Instant 不算 Buff；只是属性修改必须走 GE

Buff 回退

增加和删除 GE
- ApplGameplayEffectToSelf
- ApplyGameplayEffectToOwner
- Remove Active GameplayEffect
GE 类 UGameplayEffect
运行时会实例化一个轻量级的结构体 FActiveGameplayEffect

ASC 通过 FActiveGameplayEffectContainer 存正在生效的 GE的轻量化结构体；
结构体内存 FGameplayEffectSpec 以及Duratioin 和 Period 的 Handle

GE 中定义属性的修改规则；Spec中存储具体数值


# 技能同步
属性同步（Replicate）、动作同步（RPC）

GAS的同步方案：让 GA 同时在服务端和客户端（主控端）执行

GA 的启动模式
- Local predicted 客户端预测
Client先运行、再通知 Server；Server 执行 CanActivate，可以执行则正常运行
若 Server 发现不满足执行条件；会返回 Fail 消息
- Local Only
- Server Initiated 服务器先行
此时 Client 所有的 ApplyGE 调用都会跳过；只在服务端进行
如果 Client 先行、要先发起执行请求到服务器，等服务器通知客户端执行；

- 预测正确时：
    - 服务器确认消息意义何在？
    - 客户端会执行 ApplyGE
- 预测错误时：
    - 播放声音和动作即时停止；
    - 状态修改需要回退
    通过 Predication Key 唯一标识正在运行的 GA 实例
- Server Only

FScopedPredictionWindow 在构造函数中设置 ASC的当前预测 Key （ScopedPredictionKey），在析构函数中取消设置（恢复成-1）。
通过 Key 将服务器的 GE 实例和本地预测绑定。
客户端的 Key 是本地生成的；服务器的 Key 是 客户端传来的

GE 的回滚规则
当客户端收到服务器带 Key 的消息，客户端都需要移除本地和该Key关联的所有GE。（无论服务器执行成功、失败，客户端的本地状态都会回退）

Instant的GE 修改客户端 Instant GE 需要创建 GE 对象（为了后续删除）；服务端执行直接创建实例执行；通过 Replicate 复制到客户端

技能同步的问题：每次加 GE 之前都生成一个 Key 发给服务器，弊端：服务器技能流程出现空隙，技能运行不丝滑
解决方案：预分配 Key，同一个 GA 内第一次分配Key，后续+1


一个 ASC 对象 4936 字节
要明确 GAS 的适用范围

人物的基础动作：走跑跳蹲
场景交互
简单的NPC对话动作
其他不会修改基础战斗属性的功能


# 网络相关

## GA（Gameplay Ability）的执行位置

GA的执行位置取决于**Net Execution Policy（网络执行策略）**：

### 1. **Local Predicted（客户端预测）**
- **主控端（Autonomous Proxy）**：✅ 先执行
- **服务器（Server）**：✅ 后执行
- **模拟端（Simulated Proxy）**：❌ 不执行

**流程**：
1. 主控端先运行GA，立即响应玩家操作
2. 主控端通知服务器执行
3. 服务器执行`CanActivate`检查，如果通过则正常运行
4. 如果服务器发现不满足执行条件，会返回Fail消息给客户端
5. 客户端收到Fail后会回滚状态（通过Prediction Key机制）

### 2. **Server Initiated（服务器先行）**
- **服务器（Server）**：✅ 先执行
- **主控端（Autonomous Proxy）**：✅ 后执行（收到服务器通知后）
- **模拟端（Simulated Proxy）**：❌ 不执行

**特点**：
- 主控端的所有`ApplyGE`调用都会跳过，只在服务端进行
- 客户端需要等待服务器通知才能执行

### 3. **Local Only（仅本地）**
- **主控端（Autonomous Proxy）**：✅ 执行
- **服务器（Server）**：❌ 不执行
- **模拟端（Simulated Proxy）**：❌ 不执行

### 4. **Server Only（仅服务器）**
- **服务器（Server）**：✅ 执行
- **主控端（Autonomous Proxy）**：❌ 不执行
- **模拟端（Simulated Proxy）**：❌ 不执行

---

## GE（Gameplay Effect）的执行位置

GE的执行位置取决于**GA的执行策略**和**ASC的同步模式**：

### 基本规则：
- **服务器（Server）**：✅ 始终执行（权威）
- **主控端（Autonomous Proxy）**：
  - Local Predicted模式下：✅ 执行（预测性执行）
  - Server Initiated模式下：❌ 跳过（等待服务器同步）
- **模拟端（Simulated Proxy）**：❌ 不执行GE逻辑，只接收属性同步结果

### GE的同步机制：

#### **Instant GE（瞬时效果）**
- 服务器：直接创建实例执行，修改属性
- 主控端（预测模式）：需要创建GE对象（为了后续可能的回滚删除）
- 属性修改通过Replicate同步到客户端

#### **Duration/Infinite GE（持续效果）**
- 服务器：维护在`FActiveGameplayEffectContainer`中
- 主控端（预测模式）：也维护在本地容器中，通过Prediction Key关联
- 当服务器确认或拒绝时，客户端会移除本地和该Key关联的所有GE

---

## GC（Gameplay Cue）的执行位置

GC是**纯表现层**的效果，执行位置取决于**Replication模式**：

### 基本规则：
- **服务器（Server）**：✅ 可以执行（但通常不需要）
- **主控端（Autonomous Proxy）**：✅ 执行
- **模拟端（Simulated Proxy）**：✅ 执行


- 所有客户端都会收到OnActive/OnRemove事件
- ASC维护ActiveGameplayCue列表
- 适合：BUFF特效、持续音效

---

## 总结表格

| 组件 | 服务器 | 主控端 | 模拟端 | 备注 |
|------|--------|--------|--------|------|
| **GA** | ✅ | ✅ | ❌ | 取决于Net Execution Policy |
| **GE** | ✅（权威） | ✅（预测） | ❌ | 模拟端只接收属性同步 |
| **GC** | ✅（可选） | ✅ | ✅ | 纯表现，所有客户端都执行 |

## 关键要点

1. **GA和GE的逻辑只在服务器和主控端执行**，模拟端不参与游戏逻辑计算
2. **GC在所有客户端执行**，用于播放音效和特效
3. **预测机制**通过Prediction Key实现客户端预测和服务器确认的同步
4. **模拟端**只负责接收属性同步结果和播放表现效果，不执行游戏逻辑


# DS 上不存在、不可用内容

### 🚫 DS 上不存在/不可用的内容

| 类别 | 具体内容 | 说明 |
|------|----------|------|
| **渲染相关** | 材质、特效、粒子、后处理 | DS 没有渲染管线 |
| **音频相关** | 声音播放、音效 | DS 没有音频设备 |
| **输入相关** | 键盘/鼠标/手柄输入、按键事件 | DS 没有玩家输入设备 |
| **UI相关** | Widget、HUD、UMG | DS 不显示界面 |
| **本地玩家** | `GetMainCharacter()`、`GetLocalPlayerController()` | DS 没有"本地玩家"概念 |
| **主控端/模拟端** | `IsLocallyControlled()` | 对 DS 来说所有玩家都一样 |
| **摄像机** | `GetPlayerCameraManager()`、ViewTarget | DS 没有视角/摄像机 |

### ✅ DS 上应该运行的内容

| 类别 | 具体内容 | 说明 |
|------|----------|------|
| **游戏逻辑** | 伤害计算、碰撞检测、AI决策 | DS 是权威端 |
| **数据同步** | 属性复制、RPC调用 | DS 负责同步给客户端 |
| **校验逻辑** | 反作弊、数据合法性检查 | 防止客户端作弊 |
| **状态管理** | GameState、PlayerState | DS 管理游戏状态 |

### 🔧 常用判断方法

```lua
-- 判断是否是客户端
if _MOE.Utils.WorldUtils:IsClient() then
    -- 只在客户端执行：UI、特效、声音、本地表现等
end

-- 判断是否是服务器（包括 DS 和 ListenServer）
if _MOE.Utils.WorldUtils:IsServer() then
    -- 只在服务器执行：权威逻辑、数据校验等
end

-- 判断是否是专用服务器
if UE4.UKismetSystemLibrary.IsDedicatedServer(worldContext) then
    -- 只在DS执行
end
```

