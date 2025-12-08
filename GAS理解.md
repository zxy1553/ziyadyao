

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
