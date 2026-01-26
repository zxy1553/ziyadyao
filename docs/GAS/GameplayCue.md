## GameplayCue：音效 / 特效使用笔记

---

### 2. 整体流程总览（从外到内）

1. **DataTable 配置 GameplayTag**：在项目的 GameplayTags 表里定义一个 Tag，用来标识某个音效 / 特效 Cue
2. **创建 GameplayCue**：新建或复用一个 Cue 资产 / 类，负责在被触发时播放音效 / 特效
3. **在代码里准备参数**：构造 `FGameplayCueParameters`（尽可传递UE预分配参数），需要更复杂数据时往 `EffectContext` 里塞自定义参数（自定义键，给定对应值进行数据传递）
4. **通过 `AddGameplayCueTag` 触发 Cue**：传入 Tag + 参数
5. **Cue 内部回调执行**：`OnExecute` / `OnActive` / `WhileActive` / `OnRemove` 等函数里读取参数，真正播放音效 / 特效

---

### 3. GameplayTag：定义与获取

#### 3.1 在编辑器中定义 Tag

1. 打开 **Project Settings → GameplayTags**
2. 在 **Gameplay Tags** 里添加你需要的 Tag，例如：
   - `GameplayCue.Skill.FireballImpact`
   - `GameplayCue.Buff.SpeedUp`
3. 点击 **Add New Gameplay Tag** 并保存（会写入 `DefaultGameplayTags.ini` 等配置文件）

> 约定上，GameplayCue 相关 Tag 一般以 `GameplayCue.` 开头，方便在代码中一眼区分。

#### 3.2 在代码中获取 Tag

常用方式是通过 `FGameplayTag::RequestGameplayTag`：

```cpp
// Get tag that was defined in GameplayTags settings
const FGameplayTag CueTag = FGameplayTag::RequestGameplayTag(TEXT("GameplayCue.Skill.FireballImpact"));
```

项目里也可以用宏或封装（例如静态定义 Tag），本质都是拿到一个 `FGameplayTag` 作为后续激活 Cue 的“钥匙”。

---

### 4. 参数传递：CueParameters vs EffectContext

GameplayCue 触发时，会带上一份 `FGameplayCueParameters`，里面既包含 UE 预定义的字段，也可以通过 `EffectContext` 扩展自定义字段。

#### 4.1 CueParameters：UE 自带字段

这是最基础、最类型安全的方式，直接往 `CueParameters` 里填数据：

```cpp
// Basic way: pass parameters through CueParameters properties directly
AdjustParam.TargetAttachComponent = TaskTarget->GetRootComponent();
AdjustParam.Instigator = Context->GetSelfActor();
AdjustParam.Location = ...;
```

特点：

- **UE 原生支持**：`Location`、`Instigator`、`TargetAttachComponent` 等字段
- **类型安全、编辑器友好**：蓝图里也能清楚看到
- **限制**：字段有限，只能用 UE 预定义的这些属性

#### 4.2 EffectContext：自定义扩展字段

当需要传更多参数（比如附加的 `Rotator`、额外的 `Scale`、自定义 Target 信息等），可以把它们塞到 `EffectContext` 里：

```cpp
// Use EffectContext to pass custom key-value style parameters
UMoeAbilitySystemLibrary::AddCustomRotatorParamsInEffectContext(AdjustParam.EffectContext, "Rotator", Rotator);
UMoeAbilitySystemLibrary::AddCustomVectorParamsInEffectContext(AdjustParam.EffectContext, "Location", Location);
UMoeAbilitySystemLibrary::AddCustomVectorParamsInEffectContext(AdjustParam.EffectContext, "Scale", Scale);
```

特点：

- **可扩展**：想传什么都行（Vector、Rotator、自定义 struct 等）
- **通过 Key 管理**：例如 `"Location"`、`"Scale"`、`"Rotator"`，需要自己约定好命名
- **取值时需要类型转换**：从 `EffectContext` 里按 Key 取出，再转成对应类型

简单对比总结：

- **普通 CueParameters**
  - UE 原生支持，类型安全，编辑器友好
  - 字段有限，只能传 UE 预定义的字段
- **EffectContext 自定义**
  - 可扩展，想传什么都可以
  - 需要自己维护键名，取值时要做类型转换

---

### 5. 外部链路：从 DataTable 到激活 GameplayCue

这部分回答的是：**“代码外面（系统整体）是怎么从 Tag 走到真正触发 Cue 的？”**

#### 5.1 DataTable 配置 CueTag

项目里一般会有一个 DataTable，用来配置：

- **CueTag**：比如 `GameplayCue.Skill.FireballImpact`
- **Cue 资源 / 类**：
  - 对应的 `UGameplayCueNotify_Actor` / `UGameplayCueNotify_Static` / BP 派生类
  - 或者直接配置 Niagara / Particle / Sound 资源等

运行时，系统会通过这个表根据 `CueTag` 找到要使用的 Cue。

#### 5.2 激活 Cue 的关键函数

在实际代码中，一般会通过 `AbilitySystemComponent` 或项目自己的封装函数来激活 Cue，例如：

```cpp
// Pseudo code: trigger a GameplayCue for sound / VFX
FGameplayCueParameters AdjustParam;
// 1) Fill CueParameters basic fields
AdjustParam.TargetAttachComponent = TaskTarget->GetRootComponent();
AdjustParam.Instigator = Context->GetSelfActor();
AdjustParam.Location = HitLocation;

// 2) Fill EffectContext custom fields if needed
UMoeAbilitySystemLibrary::AddCustomVectorParamsInEffectContext(AdjustParam.EffectContext, "Scale", VfxScale);

// 3) Get GameplayTag
const FGameplayTag CueTag = FGameplayTag::RequestGameplayTag(TEXT("GameplayCue.Skill.FireballImpact"));

// 4) Trigger GameplayCue (project-specific wrapper)
// For example: AbilitySystemComponent->AddGameplayCue(CueTag, AdjustParam);
// Or: UMoeAbilitySystemLibrary::AddGameplayCueTag(ASC, CueTag, AdjustParam);
```

关键点：

- **真正激活 Cue 的函数**：通常是类似 `AddGameplayCue` / `AddGameplayCueTag` 的接口
- **需要的输入**：`GameplayTag` + `FGameplayCueParameters`（或你们项目包装好的参数结构）
- **Tag → Cue 的映射**：靠 DataTable 或引擎内置的 GameplayCue 配置来完成

---

### 6. Cue 内部：关键回调函数

当 `AddGameplayCue` / `AddGameplayCueTag` 被调用后，引擎会根据 Tag 找到对应的 GameplayCue，并调用其内部回调。

以 `UGameplayCueNotify_Actor` 为例，常见回调有：

- **`OnExecute`**
  - 适合“一次性”效果
  - 比如：碰撞瞬间播放一个音效、打出一个爆炸特效
- **`OnActive` + `WhileActive` + `OnRemove`**
  - 适合“持续性”效果
  - 常规用法：
    - `OnActive`：Cue 刚被添加时（创建粒子，Attach 到角色）
    - `WhileActive`：每 Tick 调用，可以做持续更新（位置、缩放、颜色）
    - `OnRemove`：Cue 被移除时（销毁粒子，停止音效）

在这些回调里，你可以读取刚刚通过 `CueParameters` 和 `EffectContext` 传进来的参数：

```cpp
void UMyGameplayCue::OnExecute_Implementation(AActor* MyTarget, const FGameplayCueParameters& Parameters)
{
    // 1) Basic parameters
    const FVector  Location = Parameters.Location;
    AActor*        Instigator = Parameters.Instigator.Get();
    USceneComponent* AttachComp = Parameters.TargetAttachComponent;

    // 2) Custom parameters from EffectContext (pseudo code)
    const FVector  Scale   = UMoeAbilitySystemLibrary::GetCustomVectorParam(Parameters.EffectContext, "Scale", FVector::OneVector);
    const FRotator Rotator = UMoeAbilitySystemLibrary::GetCustomRotatorParam(Parameters.EffectContext, "Rotator", FRotator::ZeroRotator);

    // 3) Play VFX / SFX here using the above parameters
}
```

> 实战上：**OnExecute 负责“一下子打出去”的音效 / 特效，OnActive / WhileActive / OnRemove 负责“挂在身上、持续变化”的效果。**

---

### 7. Cue 生命周期：从 ASC 到 GameplayCueNotify_Actor

这一节从“**谁在什么时候调用谁**”的角度，梳理一下 Cue 的生命周期，让新手知道 Cue 什么时候被创建、什么时候变成 Active、什么时候被 Remove / 销毁。

#### 7.1 三个核心角色是谁？

- **`UAbilitySystemComponent`（ASC）**
  - 负责管理 `GameplayEffect`、`GameplayTag` 和内部的 `ActiveGameplayCue` 列表
  - 把 GE / Tag 的变化转换成 GameplayCue 事件：`OnActive` / `WhileActive` / `OnRemove` / `Execute`
- **`UGameplayCueManager`**
  - 收到 ASC 发来的 Cue 事件（带 `Tag` + `EventType` + `FGameplayCueParameters`）
  - 根据 Tag 找到对应的 GameplayCue 资源 / 类
  - 创建或复用 `GameplayCueNotify_Actor`，或者调用 `GameplayCueNotify_Static`
- **`GameplayCueNotify_Actor`（或项目自定义派生类）**
  - 真正执行“播放音效 / 特效”的逻辑
  - 在 `OnExecute` / `OnActive` / `WhileActive` / `OnRemove` 里，根据传入参数决定播什么、播多久、是否 Auto Destroy

> 简单记：**ASC 记账 + 发信号，GameplayCueManager 找人，GameplayCueNotify 来干活。**

#### 7.2 Execute 型（一发即终）的生命周期

适用于“命中一下就结束”的音效 / 特效（例如：子弹命中声、爆炸特效）。流程大致如下：

1. **代码触发一次性事件**
   - 例如：
   ```cpp
   const FGameplayTag CueTag = FGameplayTag::RequestGameplayTag(TEXT("GameplayCue.Skill.FireballImpact"));
   AbilitySystemComponent->ExecuteGameplayCue(CueTag, AdjustParam); // 一次性执行
   ```
2. **ASC 发出 `Executed` 事件**
   - ASC 不会把这个 Cue 长期记在 `ActiveGameplayCue` 列表里
   - 只是立刻把 `EGameplayCueEvent::Executed` 连同参数一起发给 `UGameplayCueManager`
3. **GameplayCueManager 定位并实例化 Cue**
   - 根据 `CueTag` 找到对应的 `GameplayCueNotify_Actor`
   - 如有需要，会创建 / 复用一个 Cue Actor 实例，并调用它的 `OnExecute`
4. **GameplayCueNotify_Actor::OnExecute 播放一次性效果**
   - 在 `OnExecute` 里读取 `Parameters` / `EffectContext`，播放一次性特效 / 音效
   - 粒子 / Niagara / Sound 通常都勾选 Auto Destroy，播完自动销毁
5. **Cue Actor 生命周期结束 / 回收到池子**
   - 播放结束后，Cue Actor 会根据配置被销毁或回收到对象池

**特点：**

- 没有 `Add` / `Remove` 的配对逻辑
- ASC 不维护长期 Active 状态
- **你不需要、也不应该为这种一次性 Cue 手动调用 `RemoveGameplayCue`**，音效 / 特效播完就结束

#### 7.3 Add / Remove 型（持续性）的生命周期

适用于 BUFF、持续光效、持续环境音等“活一段时间”的效果。这里分两种常见驱动方式：

##### 7.3.1 由 GameplayEffect 驱动（推荐）

1. **GE 被应用到 ASC**
   - 一个有持续时间的 `GameplayEffect` 应用到 ASC 时，ASC 会把 GE 中配置的 GameplayCues 展开
2. **ASC 发出 `OnActive` 事件**
   - 对每个 CueTag，ASC 会发出 `EGameplayCueEvent::OnActive`（必要时后续还有 `WhileActive`）
3. **GameplayCueManager 创建 / 复用 Cue Actor**
   - 根据 Tag 找到对应 `GameplayCueNotify_Actor`
   - Spawn / Attach 到目标 Actor 上，并调用 `OnActive`
4. **GameplayCueNotify_Actor::OnActive 开始“挂在身上”的效果**
   - 在 `OnActive` 里创建持续特效 / 环境音，Attach 到角色 / 场景
   - 有需要的话在 `WhileActive` 每 Tick 更新位置 / 参数
5. **GE 结束或被移除**
   - 当 GE 自然过期、被驱散、或者栈数降为 0 时，ASC 会发出 `EGameplayCueEvent::Removed`
6. **GameplayCueManager 调用 `OnRemove`**
   - Cue 的 `OnRemove` 被调用，在这里停止音效 / 特效，移除组件，最后根据配置销毁 Cue Actor

**特点：**

- 生命周期完全跟随 GameplayEffect
- 大多数情况下，**你不需要手写 `RemoveGameplayCue`**，GAS 会随着 GE 生命周期自动触发 Remove

##### 7.3.2 由手动 Add / RemoveGameplayCue 驱动

在某些场景下，你可能不通过 GE，而是直接在代码里控制 Cue 的开始/结束：

```cpp
// 开始持续类 Cue
ASC->AddGameplayCue(CueTag, AdjustParam);

// ... 中途逻辑 ...

// 结束持续类 Cue
ASC->RemoveGameplayCue(CueTag);
```

对应生命周期：

1. `AddGameplayCue`：
   - ASC 把该 Cue 记录进 `ActiveGameplayCue` 容器（可能带计数）
   - 通过 GameplayCueManager 触发 `OnActive`（必要时后续有 `WhileActive`）
2. `RemoveGameplayCue`：
   - ASC 将计数减一 / 移除该 Cue，当计数归零时发出 `Removed` 事件
   - GameplayCueManager 调用 Cue 的 `OnRemove`，由 Cue 自己收尾并销毁 Actor

**特点：**

- 适合“逻辑上开始和结束由你自己掌控”的效果
- **需要你显式成对调用 `Add` / `Remove`**，否则 ASC 会一直认为这个 Cue 处于 Active 状态

#### 7.4 针对“用 Cue 播音效”的实践建议

- **一次性命中音效 / 爆炸音**
  - 尽量使用 **Execute 风格**：`ExecuteGameplayCue` → `OnExecute`
  - 游戏里听到的是一个固定时长的 SoundCue / SoundWave，资源上勾选 Auto Destroy
  - **不需要手动 `RemoveGameplayCue`**，Cue 播完就结束
- **持续环境音 / BUFF 循环音效**
  - 如果有对应的 GameplayEffect：直接在 GE 上配置 GameplayCue，让 GE 生命周期自动驱动 Add / Remove
  - 如果没有 GE：在逻辑开始时 `AddGameplayCue`，在逻辑结束时 `RemoveGameplayCue`
  - Cue 的 `OnActive` 创建 Loop 音源并 Attach，`OnRemove` 负责 Stop / 销毁

整体记忆：

- **"一下就完"的效果 → Execute，不关心 Remove**
- **"要活一段时间"的效果 → Add / Remove，生命周期一般交给 GE 或你自己的逻辑配对管理**

---

### 8. GC 播放音效 & 特效的通用流程

本节从**泛用角度**总结通过 GameplayCue 播放音效和特效的完整流程，涵盖：参数配置 → 参数获取 → 条件检查 → 实际播放。

---

#### 8.1 音效播放流程

##### 8.1.1 所需参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| `SoundID` | int | 音效资源ID（项目自定义的音效管理系统） |
| `SoundPlayType` | enum | 播放条件类型 |
| `Target` | AActor | 音效播放的目标Actor |

**SoundPlayType 枚举值：**
- `EST_Both (0)`：所有客户端都播放
- `EST_OnlyAutonomousProxy (1)`：仅本地控制的角色播放（自己听自己的）
- `EST_OnlySimulatedProxy (2)`：仅模拟代理角色播放（别人听你的）

##### 8.1.2 参数配置方式

**方式一：通过 SourceObject 传递配置对象**
```cpp
// C++ 侧：将配置对象放入 SourceObject
FGameplayCueParameters Params;
Params.SourceObject = MyConfigTask;  // 包含 SoundID、SoundPlayType 等字段
ASC->AddGameplayCue(CueTag, Params);
```

**方式二：通过 EffectContext 传递自定义参数**
```cpp
// C++ 侧：使用自定义参数
UMoeAbilitySystemLibrary::AddCustomIntParamsInEffectContext(Params.EffectContext, "SoundID", SoundID);
```

##### 8.1.3 参数获取（Cue 内部）

```lua
-- Lua 侧：从 Parameters 中获取配置
function MyCue:WhileActive(Target, Parameters)
    -- 方式一：从 SourceObject 获取
    local Task = Parameters.SourceObject
    local AddCueTask = Task:Cast(UE4.UMoeAblAddCueWithParamsTask)
    local SoundID = AddCueTask.SoundID
    local SoundPlayType = AddCueTask.SoundPlayType
    
    -- 方式二：从 EffectContext 获取
    -- local SoundID = GetCustomIntParam(Parameters.EffectContext, "SoundID")
end
```

##### 8.1.4 条件检查（CheckSoundPlayCondition）

```lua
function MyCue:CheckSoundPlayCondition(SoundPlayType, Actor)
    if not Actor then return false end
    
    local bIsLocalPawn = self:IsLocallyControlledActor(Actor)
    
    if SoundPlayType == EST_OnlyAutonomousProxy then
        return bIsLocalPawn        -- 仅本地角色播放
    elseif SoundPlayType == EST_OnlySimulatedProxy then
        return not bIsLocalPawn    -- 仅模拟代理播放
    end
    
    return true  -- EST_Both：都播放
end
```

##### 8.1.5 实际播放

调用 _MOE.SoundMgr:ReceivePlaySfx(SoundID, bIs3P, SoundTarget, true)播放

```lua
function MyCue:PlaySound(SoundID, SoundPlayType, SoundTarget)
    -- 1. 条件检查
    if not self:CheckSoundPlayCondition(SoundPlayType, SoundTarget) then
        return
    end
    
    -- 2. 停止之前的音效（如果有）
    if self.SoundPlaying and self.SoundPlaying > 0 then
        _MOE.SoundMgr:ReceiveStopSfx(self.SoundPlaying, bIs3P, self.SoundTarget)
    end
    
    -- 3. 播放新音效
    local bIs3P = not self:IsLocallyControlledActor(SoundTarget)
    local PlayingId = _MOE.SoundMgr:ReceivePlaySfx(SoundID, bIs3P, SoundTarget, true)
    
    -- 4. 记录状态（用于 OnRemove 清理）
    self.SoundPlaying = SoundID
    self.SoundTarget = SoundTarget
end
```

##### 8.1.6 生命周期清理（OnRemove）

调用 _MOE.SoundMgr:ReceiveStopSfx(self.SoundPlaying, bIs3P, self.SoundTarget) 结束

```lua
function MyCue:OnRemove(Target, Parameters)
    -- 停止音效
    if self.SoundPlaying and self.SoundPlaying > 0 then
        _MOE.SoundMgr:ReceiveStopSfx(self.SoundPlaying, bIs3P, self.SoundTarget)
    end
    self.SoundPlaying = nil
    self.SoundTarget = nil
end
```

---

#### 8.2 特效播放流程

##### 8.2.1 所需参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| `ParticleAsset` | UParticleSystem | 粒子系统资源 |
| `PlayCondition` | enum | 播放条件类型 |
| `bAttach` | bool | 是否绑定到组件 |
| `AttachCompType` | enum | 挂载组件类型 |
| `AttachComponentTag` | string | 自定义组件Tag（当 AttachCompType = Custom 时使用） |
| `AttachBoneName` | string | 绑定骨骼名称 |
| `AttachRule` | enum | 绑定规则 |
| `bFollowRotation` | bool | 是否跟随旋转 |
| `bFollowLocation` | bool | 是否跟随位置 |
| `RelativeLocation` | FVector | 相对位置偏移 |
| `RelativeRotation` | FRotator | 相对旋转偏移 |
| `RelativeScale` | FVector | 相对缩放 |

**PlayCondition 枚举值：**
- `PlayCondition_Both (1)`：所有客户端都播放
- `PlayCondition_OnlySelf (2)`：仅自己（Instigator）能看到

**AttachCompType 枚举值：**
- `AttachCompType_Skeletal (0)`：骨骼网格体组件
- `AttachCompType_Root (1)`：根组件
- `AttachCompType_Custom (2)`：自定义Tag组件

**AttachRule 枚举值：**
- `KeepRelativeOffset (0)`：保持相对偏移
- `KeepWorldPosition (1)`：保持世界位置
- `SnapToTarget (2)`：吸附到目标
- `SnapToTargetIncludingScale (3)`：吸附到目标（含缩放）

##### 8.2.2 参数配置方式

```cpp
// C++ 侧：配置 Task 对象
UMoeAblAddCueWithParamsTask* Task = NewObject<UMoeAblAddCueWithParamsTask>();
Task->ParticleAsset = MyParticle;
Task->PlayCondition = PlayCondition_Both;
Task->bAttach = true;
Task->AttachCompType = AttachCompType_Skeletal;
Task->AttachBoneName = "spine_01";
Task->RelativeLocation = FVector(0, 0, 50);
Task->RelativeScale = FVector(1.5f, 1.5f, 1.5f);

FGameplayCueParameters Params;
Params.SourceObject = Task;
```

##### 8.2.3 参数获取（Cue 内部）

```lua
function MyCue:WhileActive(Target, Parameters)
    local Task = Parameters.SourceObject:Cast(UE4.UMoeAblAddCueWithParamsTask)
    
    -- 基础配置
    local ParticleAsset = Task.ParticleAsset
    local PlayCondition = Task.PlayCondition or PlayCondition_Both
    
    -- 绑定配置
    local bAttach = Task.bAttach or false
    local AttachCompType = Task.AttachCompType or AttachCompType_Skeletal
    local AttachComponentTag = Task.AttachComponentTag or ""
    local AttachBoneName = Task.AttachBoneName or ""
    local AttachRule = Task.AttachRule or AttachLocation_KeepRelativeOffset
    local bFollowRotation = Task.bFollowRotation ~= false  -- 默认 true
    local bFollowLocation = Task.bFollowLocation ~= false  -- 默认 true
    
    -- 位置配置
    local RelativeLocation = Task.RelativeLocation or UE4.FVector(0, 0, 0)
    local RelativeRotation = Task.RelativeRotation or UE4.FRotator(0, 0, 0)
    local RelativeScale = Task.RelativeScale or UE4.FVector(1, 1, 1)
end
```

##### 8.2.4 条件检查（CheckParticlePlayCondition）

```lua
function MyCue:CheckParticlePlayCondition(PlayCondition, Parameters)
    if PlayCondition == PlayCondition_Both then
        return true  -- 所有人都播放
    end
    
    if PlayCondition == PlayCondition_OnlySelf then
        -- 仅 Instigator 本地播放
        local Instigator = Parameters.Instigator
        if Instigator and Instigator.IsLocalPawn and Instigator:IsLocalPawn() then
            return true
        end
        return false
    end
    
    return true
end
```

##### 8.2.5 获取挂载组件（GetAttachComponent）

```lua
function MyCue:GetAttachComponent(Target, AttachCompType, AttachComponentTag, Parameters)
    -- 优先使用 C++ 侧传入的 TargetAttachComponent
    if Parameters.TargetAttachComponent and UE4.UKismetSystemLibrary.IsValid(Parameters.TargetAttachComponent) then
        return Parameters.TargetAttachComponent
    end
    
    -- 根据类型获取组件
    if AttachCompType == AttachCompType_Skeletal then
        -- 优先获取 Character 的 Mesh
        local Character = Target:Cast(UE4.ACharacter)
        if Character then
            return Character:GetMesh()
        end
        -- 回退：获取任意 SkeletalMeshComponent
        return Target:GetComponentByClass(UE4.USkeletalMeshComponent)
        
    elseif AttachCompType == AttachCompType_Root then
        return Target:GetRootComponent()
        
    elseif AttachCompType == AttachCompType_Custom then
        -- 根据 Tag 获取组件
        if AttachComponentTag ~= "" then
            local Components = Target:GetComponentsByTag(UE4.USceneComponent, AttachComponentTag)
            if Components and Components:Length() > 0 then
                return Components:Get(1)
            end
        end
    end
    
    -- 最终回退到根组件
    return Target:GetRootComponent()
end
```

##### 8.2.6 实际播放

绑定方式播放特效：UE4.UGameplayStatics.SpawnEmitterAttached
在世界播放特效：UE4.UGameplayStatics.SpawnEmitterAtLocation


```lua
function MyCue:PlayParticle(ParticleAsset, PlayCondition, Target, Parameters, ...)
    -- 1. 条件检查
    if not self:CheckParticlePlayCondition(PlayCondition, Parameters) then
        return
    end
    
    local PSC = nil
    
    if bAttach then
        -- ===== 绑定模式 =====
        local AttachComponent = self:GetAttachComponent(Target, AttachCompType, AttachComponentTag, Parameters)
        if not AttachComponent then return end
        
        -- 生成并绑定特效
        PSC = UE4.UGameplayStatics.SpawnEmitterAttached(
            ParticleAsset,
            AttachComponent,
            AttachBoneName,        -- Socket/Bone 名称
            RelativeLocation,
            RelativeRotation,
            RelativeScale,
            AttachRule,
            true,                  -- bAutoDestroy
            UE4.EPSCPoolMethod.None,
            true                   -- bAutoActivate
        )
        
        -- 处理跟随设置
        if PSC and UE4.UKismetSystemLibrary.IsValid(PSC) then
            if not bFollowRotation then
                PSC:SetAbsolute(false, true, false)  -- 不跟随旋转
            end
            if not bFollowLocation then
                PSC:SetAbsolute(true, false, false)  -- 不跟随位置
            end
        end
    else
        -- ===== 世界位置模式 =====
        local WorldLocation = RelativeLocation
        local WorldRotation = RelativeRotation
        
        if Target then
            local ActorLocation = Target:K2_GetActorLocation()
            local ActorRotation = Target:K2_GetActorRotation()
            
            -- 将相对偏移转换为世界坐标
            local RotatedOffset = UE4.UKismetMathLibrary.GreaterGreater_VectorRotator(RelativeLocation, ActorRotation)
            WorldLocation = ActorLocation + RotatedOffset
            WorldRotation = UE4.UKismetMathLibrary.ComposeRotators(RelativeRotation, ActorRotation)
        end
        
        -- 在世界位置生成特效
        PSC = UE4.UGameplayStatics.SpawnEmitterAtLocation(
            Target,
            ParticleAsset,
            WorldLocation,
            WorldRotation,
            RelativeScale,
            true,                  -- bAutoDestroy
            UE4.EPSCPoolMethod.None,
            true                   -- bAutoActivate
        )
    end
    
    -- 记录状态（用于 OnRemove 清理）
    self.SpawnedPSC = PSC
end
```

##### 8.2.7 生命周期清理（OnRemove）

```lua
function MyCue:OnRemove(Target, Parameters)
    -- 销毁特效组件
    if self.SpawnedPSC and UE4.UKismetSystemLibrary.IsValid(self.SpawnedPSC) then
        self.SpawnedPSC:DestroyComponent(self.SpawnedPSC)
    end
    self.SpawnedPSC = nil
end
```

---

