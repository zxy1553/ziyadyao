import torch
import torch.nn as nn
import torch.optim as optim
import torchvision
import torchvision.transforms as transforms
from torch.utils.data import DataLoader
import time

# ==========================================
# 1. 超参数设置 (Hyperparameters)
# ==========================================
BATCH_SIZE = 64
LEARNING_RATE = 0.001
EPOCHS = 5
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

print(f"Using device: {DEVICE}")

# ==========================================
# 2. 数据准备 (Data Preparation)
# ==========================================
# 定义数据预处理：转为 Tensor 并归一化
transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.1307,), (0.3081,)) # MNIST 的均值和标准差
])

# 下载并加载训练集
train_dataset = torchvision.datasets.MNIST(
    root='./data', 
    train=True, 
    transform=transform, 
    download=True
)

# 下载并加载测试集
test_dataset = torchvision.datasets.MNIST(
    root='./data', 
    train=False, 
    transform=transform, 
    download=True
)

# 创建 DataLoader
# DataLoader 负责批次化、打乱数据、多进程加载
train_loader = DataLoader(dataset=train_dataset, batch_size=BATCH_SIZE, shuffle=True)
test_loader = DataLoader(dataset=test_dataset, batch_size=BATCH_SIZE, shuffle=False)

# ==========================================
# 3. 模型定义 (Model Definition)
# ==========================================
class SimpleCNN(nn.Module):
    def __init__(self):
        super(SimpleCNN, self).__init__()
        # 第一层卷积: 输入 1通道, 输出 32通道, 核大小 3x3
        self.conv1 = nn.Conv2d(in_channels=1, out_channels=32, kernel_size=3, stride=1, padding=1)
        self.relu = nn.ReLU()
        # 池化层: 2x2
        self.pool = nn.MaxPool2d(kernel_size=2, stride=2)
        # 第二层卷积: 输入 32通道, 输出 64通道
        self.conv2 = nn.Conv2d(in_channels=32, out_channels=64, kernel_size=3, stride=1, padding=1)
        
        # 全连接层
        # 经过两次 2x2 池化，28x28 -> 14x14 -> 7x7
        # 所以输入维度是 64 * 7 * 7
        self.fc1 = nn.Linear(64 * 7 * 7, 128)
        self.fc2 = nn.Linear(128, 10) # 10个类别

    def forward(self, x):
        # x shape: [batch_size, 1, 28, 28]
        x = self.conv1(x)
        x = self.relu(x)
        x = self.pool(x)
        
        x = self.conv2(x)
        x = self.relu(x)
        x = self.pool(x)
        
        # Flatten: 展平用于全连接层
        x = x.view(x.size(0), -1) 
        
        x = self.fc1(x)
        x = self.relu(x)
        x = self.fc2(x)
        return x

model = SimpleCNN().to(DEVICE)

# ==========================================
# 4. 定义损失函数和优化器 (Loss & Optimizer)
# ==========================================
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=LEARNING_RATE)

# ==========================================
# 5. 训练循环 (Training Loop)
# ==========================================
def train(epoch_index):
    model.train() # 设置为训练模式 (启用 Dropout, BatchNorm 等)
    running_loss = 0.0
    correct = 0
    total = 0
    
    start_time = time.time()
    
    for i, (inputs, labels) in enumerate(train_loader):
        inputs, labels = inputs.to(DEVICE), labels.to(DEVICE)
        
        # --- 核心步骤 ---
        
        # 1. 清零梯度
        optimizer.zero_grad()
        
        # 2. 前向传播
        outputs = model(inputs)
        
        # 3. 计算损失
        loss = criterion(outputs, labels)
        
        # 4. 反向传播
        loss.backward()
        
        # 5. 更新参数
        optimizer.step()
        
        # --- 统计信息 ---
        running_loss += loss.item()
        _, predicted = torch.max(outputs.data, 1)
        total += labels.size(0)
        correct += (predicted == labels).sum().item()
        
        if (i + 1) % 100 == 0:
            print(f"Epoch [{epoch_index+1}/{EPOCHS}], Step [{i+1}/{len(train_loader)}], Loss: {loss.item():.4f}")

    end_time = time.time()
    epoch_acc = 100 * correct / total
    avg_loss = running_loss / len(train_loader)
    
    print(f"Epoch {epoch_index+1} Finished. Time: {end_time - start_time:.2f}s, Avg Loss: {avg_loss:.4f}, Accuracy: {epoch_acc:.2f}%")

# ==========================================
# 6. 评估循环 (Evaluation Loop)
# ==========================================
def evaluate():
    model.eval() # 设置为评估模式
    correct = 0
    total = 0
    
    # 不计算梯度，节省显存和计算资源
    with torch.no_grad():
        for inputs, labels in enumerate(test_loader):
            # 注意：enumerate 返回 (index, data)，这里 data 是 (images, labels)
            # 上面的写法有误，修正如下：
            pass 
        
        for inputs, labels in test_loader:
            inputs, labels = inputs.to(DEVICE), labels.to(DEVICE)
            outputs = model(inputs)
            _, predicted = torch.max(outputs.data, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()

    acc = 100 * correct / total
    print(f"Test Accuracy: {acc:.2f}%")

# ==========================================
# 7. 主执行流程
# ==========================================
if __name__ == "__main__":
    print("Starting training...")
    for epoch in range(EPOCHS):
        train(epoch)
        evaluate()
    print("Training finished!")
    
    # 保存模型
    torch.save(model.state_dict(), "mnist_cnn.pth")
    print("Model saved to mnist_cnn.pth")
