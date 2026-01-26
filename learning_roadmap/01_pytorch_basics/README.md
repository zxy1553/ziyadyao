# 第一阶段：框架掌控与现代架构重构

## 目标
从“懂公式”变成“能写代码”，彻底掌握 PyTorch，并理解 Transformer 的每一个细节。

## 核心任务
1.  **PyTorch 深度实践**：不依赖高级 API，理解 `Dataset`, `DataLoader`, `Model`, `Loss`, `Optimizer`, `Training Loop` 的底层组合。
2.  **Andrej Karpathy "Zero to Hero"**：从 Micrograd 到 NanoGPT。

## 当前练习：01_pytorch_basics
本目录包含一个纯手写的 PyTorch 训练脚本 `train_mnist_pure.py`。

### 练习目标
- 不使用 `Trainer` 或其他高级封装。
- 手动实现 Dataset 下载与加载。
- 手动编写 Training Loop（训练循环）和 Validation Loop（验证循环）。
- 理解 `optimizer.zero_grad()`, `loss.backward()`, `optimizer.step()` 的核心流程。

### 运行方法
```bash
python train_mnist_pure.py
```
