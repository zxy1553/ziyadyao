import json
import base64
import requests
from pathlib import Path
from datetime import datetime

# 确保 pics 目录存在
pics_dir = Path("pics")
pics_dir.mkdir(exist_ok=True)

# API配置
BASE_URL = "http://api.timiai.woa.com/ai_api_manage/llmproxy"
API_KEY = "xOMgAdar4sHvIo5mm7x0zR3pojM9PkZJFCsppgwY"

headers = {
    'Content-Type': 'application/json',
    'Authorization': API_KEY
}

# 选择模式
print("=" * 50)
print("请选择模式:")
print("1. 文生图 (Text-to-Image)")
print("2. 图生图 (Image-to-Image)")
print("3. 多轮生图 (Multiround Image Generation)")
print("=" * 50)
mode = input("请输入模式编号 (1/2/3): ").strip()

if mode == "1":
    # ========== 文生图模式 ==========
    user_prompt = input("请输入图片描述 (prompt): ")
    
    if not user_prompt.strip():
        print("错误: prompt 不能为空")
        exit()
    
    url = f"{BASE_URL}/images/generations"
    data_dict = {
        'model': 'gemini-3-pro-image-preview',
        'prompt': user_prompt,
        'n': 1,
        'aspect_ratio': '16:9',
        'imageSize': '2K'
    }
    
    print(f"正在生成图片: {user_prompt}")
    response = requests.post(url, headers=headers, data=json.dumps(data_dict), timeout=300)
    
    if response.status_code != 200:
        print("生成失败:")
        print(response.json())
        exit()
    
    result = response.json()
    
    # 提取并保存图片
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    for idx, item in enumerate(result['data']):
        image_data = base64.b64decode(item['b64_json'])
        filename = pics_dir / f"text2img_{timestamp}_{idx + 1}.png"
        filename.write_bytes(image_data)
        print(f"✅ 图片已保存: {filename}")

elif mode == "2":
    # ========== 图生图模式 ==========
    print("\n请输入图片路径（多张图片用英文分号;分隔）")
    print("示例: pic1.jpg;pic2.jpg 或直接输入单张图片路径")
    image_paths_input = input("图片路径: ").strip().strip('"')
    
    # 分割多个路径
    image_paths = [p.strip().strip('"') for p in image_paths_input.split(';')]
    
    # 验证所有图片是否存在
    valid_paths = []
    for path in image_paths:
        if Path(path).exists():
            valid_paths.append(path)
            print(f"✅ 已加载: {path}")
        else:
            print(f"⚠️  跳过不存在的文件: {path}")
    
    if not valid_paths:
        print("错误: 没有找到有效的图片文件")
        exit()
    
    user_prompt = input("\n请输入编辑指令 (例如: 将第一张图的风格应用到第二张图上): ")
    
    if not user_prompt.strip():
        print("错误: 编辑指令不能为空")
        exit()
    
    # 构建content数组：先添加文本，再添加所有图片
    content = [{'type': 'text', 'text': user_prompt}]
    
    # 读取并编码所有图片
    for idx, image_path in enumerate(valid_paths, 1):
        with open(image_path, 'rb') as f:
            image_b64 = base64.b64encode(f.read()).decode('utf-8')
        content.append({
            'type': 'image_url',
            'image_url': {'url': f'data:image/png;base64,{image_b64}'}
        })
        print(f"📤 正在上传第 {idx} 张图片...")
    
    url = f"{BASE_URL}/chat/completions"
    data_dict = {
        'model': 'gemini-3-pro-image-preview',
        'messages': [{
            'role': 'user',
            'content': content
        }],
        'image_config': {
            'aspect_ratio': '16:9',
            'image_size': '2K'
        },
        'response_modalities': ['IMAGE', 'TEXT']
    }
    
    print(f"正在处理图片: {user_prompt}")
    response = requests.post(url, headers=headers, json=data_dict, timeout=300)
    
    if response.status_code != 200:
        print("生成失败:")
        print(response.json())
        exit()
    
    result = response.json()
    
    # 提取并保存图片
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    message = result['choices'][0]['message']
    
    # 保存生成的图片
    for idx, img in enumerate(message.get('images', [])):
        base64_data = img['image_url']['url'].split(',', 1)[1]
        image_data = base64.b64decode(base64_data)
        filename = pics_dir / f"img2img_{timestamp}_{idx + 1}.png"
        filename.write_bytes(image_data)
        print(f"✅ 图片已保存: {filename}")
    
    # 显示模型的文本回复
    if message.get('content'):
        print(f"💬 模型回复: {message['content']}")

elif mode == "3":
    # ========== 多轮生图模式 ==========
    print("\n" + "=" * 60)
    print("🎨 多轮图像生成模式")
    print("=" * 60)
    print("\n功能说明：")
    print("- 支持多轮迭代式图像编辑")
    print("- 每轮基于上一轮结果进行优化")
    print("- 自动使用COS URL避免上下文过大")
    print("- 输入 'quit' 或 'exit' 结束生成\n")
    
    # 配置参数
    print("请选择图片宽高比:")
    print("1. 1:1 (正方形)")
    print("2. 4:3 (标准)")
    print("3. 16:9 (宽屏)")
    print("4. 9:16 (竖屏)")
    print("5. 4:5 (标准2)")
    
    ratio_map = {'1': '1:1', '2': '4:3', '3': '16:9', '4': '9:16', '5': '4:5'}
    ratio_choice = input("选择 (默认1): ").strip() or '1'
    aspect_ratio = ratio_map.get(ratio_choice, '1:1')
    
    print("\n请选择图片尺寸:")
    print("1. 1K (标清)")
    print("2. 2K (高清)")
    print("3. 4K (超清)")
    
    size_map = {'1': '1K', '2': '2K', '3': '4K'}
    size_choice = input("选择 (默认2): ").strip() or '2'
    image_size = size_map.get(size_choice, '2K')
    
    print(f"\n✅ 配置: {aspect_ratio} | {image_size}")
    print("=" * 60)
    
    # URL转换接口
    CONVERT_URL = "http://api.timiai.woa.com/ai_api_manage/file/url_conversion"
    
    def convert_base64_to_url(base64_image):
        """将Base64图片转换为COS URL"""
        if ',' in base64_image:
            base64_image = base64_image.split(',', 1)[1]
        
        payload = {
            "file_base64": base64_image,
            "file_type": ".png",
            "model": "gemini-3-pro-image-preview"
        }
        
        try:
            response = requests.post(CONVERT_URL, headers=headers, json=payload, timeout=60)
            if response.status_code == 200:
                result = response.json()
                return result.get('presigned_url')
            else:
                print(f"⚠️  URL转换失败: {response.text}")
                return None
        except Exception as e:
            print(f"⚠️  URL转换异常: {e}")
            return None
    
    # 询问起始方式
    print("\n请选择起始方式:")
    print("1. 从文本描述开始")
    print("2. 从现有图片开始")
    start_mode = input("选择 (默认1): ").strip() or '1'
    
    # 对话历史
    messages_history = []
    round_idx = 0
    url = f"{BASE_URL}/chat/completions"
    
    # 如果从图片开始，先处理初始图片
    if start_mode == '2':
        print("\n请输入初始图片路径（多张图片用英文分号;分隔）")
        image_paths_input = input("图片路径: ").strip().strip('"')
        
        # 分割多个路径
        image_paths = [p.strip().strip('"') for p in image_paths_input.split(';')]
        
        # 验证所有图片是否存在
        valid_paths = []
        for path in image_paths:
            if Path(path).exists():
                valid_paths.append(path)
                print(f"✅ 已加载: {path}")
            else:
                print(f"⚠️  跳过不存在的文件: {path}")
        
        if not valid_paths:
            print("错误: 没有找到有效的图片文件")
            exit()
        
        initial_prompt = input("\n请输入对这些图片的初始编辑指令: ").strip()
        if not initial_prompt:
            print("错误: 初始编辑指令不能为空")
            exit()
        
        # 构建初始user消息（包含图片）
        initial_content = [{'type': 'text', 'text': initial_prompt}]
        
        # 读取并编码所有图片
        for idx, image_path in enumerate(valid_paths, 1):
            with open(image_path, 'rb') as f:
                image_b64 = base64.b64encode(f.read()).decode('utf-8')
            initial_content.append({
                'type': 'image_url',
                'image_url': {'url': f'data:image/png;base64,{image_b64}'}
            })
            print(f"📤 正在上传第 {idx} 张图片...")
        
        # 添加初始消息到历史
        messages_history.append({'role': 'user', 'content': initial_content})
        
        # 生成第一轮图像
        print(f"\n🎨 正在生成第一轮图像...")
        data_dict = {
            'model': 'gemini-3-pro-image-preview',
            'messages': messages_history,
            'image_config': {
                'aspect_ratio': aspect_ratio,
                'image_size': image_size
            },
            'response_modalities': ['IMAGE', 'TEXT']
        }
        
        try:
            response = requests.post(url, headers=headers, json=data_dict, timeout=300)
            
            if response.status_code != 200:
                print(f"❌ 生成失败: {response.text}")
                exit()
            
            result = response.json()
            
            # 提取返回的图片和文本
            message = result['choices'][0]['message']
            base64_image = message['images'][0]['image_url']['url']
            text_response = message.get('content', '')
            
            # 保存图片
            if ',' in base64_image:
                base64_data = base64_image.split(',', 1)[1]
            else:
                base64_data = base64_image
            
            image_data = base64.b64decode(base64_data)
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = pics_dir / f"multiround_{timestamp}_round1.png"
            filename.write_bytes(image_data)
            print(f"✅ 图片已保存: {filename}")
            
            if text_response:
                print(f"💬 AI回复: {text_response}")
            
            # 显示Token消耗
            usage = result.get('usage', {})
            total_tokens = usage.get('total_tokens', 0)
            image_tokens = usage.get('completion_tokens_details', {}).get('image_tokens', 0)
            print(f"📊 Token消耗: 总计={total_tokens}, 图片={image_tokens}")
            
            # 转换base64为URL并构建assistant消息
            print("🔄 正在转换图片为URL...")
            cos_url = convert_base64_to_url(base64_image)
            
            # 构建assistant消息
            assistant_content = []
            if text_response:
                assistant_content.append({'type': 'text', 'text': text_response})
            
            if cos_url:
                assistant_content.append({'type': 'image_url', 'image_url': {'url': cos_url}})
                print(f"✅ 图片已转换为URL并加入历史")
            else:
                print(f"⚠️  URL转换失败，将使用Base64（可能导致上下文过大）")
                assistant_content.append({'type': 'image_url', 'image_url': {'url': base64_image}})
            
            # 添加assistant消息到历史
            messages_history.append({'role': 'assistant', 'content': assistant_content})
            
            print(f"📚 当前对话历史: {len(messages_history)} 条消息")
            round_idx = 1
            
        except Exception as e:
            print(f"❌ 请求异常: {e}")
            exit()
    
    while True:
        round_idx += 1
        print(f"\n{'='*60}")
        print(f"🔄 第 {round_idx} 轮")
        print(f"{'='*60}")
        
        # 获取用户输入
        if round_idx == 1:
            prompt = input("请输入初始图像描述: ").strip()
        else:
            prompt = input("请输入编辑指令 (quit/exit退出): ").strip()
        
        # 检查退出
        if prompt.lower() in ['quit', 'exit', 'q']:
            print("\n👋 生成结束！")
            break
        
        if not prompt:
            print("⚠️  输入不能为空，请重新输入")
            round_idx -= 1
            continue
        
        # 构建当前轮的user消息
        user_content = [{'type': 'text', 'text': prompt}]
        
        # 构建完整的messages（历史 + 当前user消息）
        current_messages = messages_history + [{'role': 'user', 'content': user_content}]
        
        # 生成图像
        data_dict = {
            'model': 'gemini-3-pro-image-preview',
            'messages': current_messages,
            'image_config': {
                'aspect_ratio': aspect_ratio,
                'image_size': image_size
            },
            'response_modalities': ['IMAGE', 'TEXT']
        }
        
        print(f"🎨 正在生成图像...")
        try:
            response = requests.post(url, headers=headers, json=data_dict, timeout=300)
            
            if response.status_code != 200:
                print(f"❌ 生成失败: {response.text}")
                round_idx -= 1
                continue
            
            result = response.json()
            
            # 提取返回的图片和文本
            message = result['choices'][0]['message']
            base64_image = message['images'][0]['image_url']['url']
            text_response = message.get('content', '')
            
            # 保存图片
            if ',' in base64_image:
                base64_data = base64_image.split(',', 1)[1]
            else:
                base64_data = base64_image
            
            image_data = base64.b64decode(base64_data)
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = pics_dir / f"multiround_{timestamp}_round{round_idx}.png"
            filename.write_bytes(image_data)
            print(f"✅ 图片已保存: {filename}")
            
            if text_response:
                print(f"💬 AI回复: {text_response}")
            
            # 显示Token消耗
            usage = result.get('usage', {})
            total_tokens = usage.get('total_tokens', 0)
            image_tokens = usage.get('completion_tokens_details', {}).get('image_tokens', 0)
            print(f"📊 Token消耗: 总计={total_tokens}, 图片={image_tokens}")
            
        except Exception as e:
            print(f"❌ 请求异常: {e}")
            round_idx -= 1
            continue
        
        # 更新对话历史：添加本轮的user消息
        messages_history.append({'role': 'user', 'content': user_content})
        
        # 转换base64为URL并构建assistant消息
        print("🔄 正在转换图片为URL...")
        cos_url = convert_base64_to_url(base64_image)
        
        # 构建assistant消息（包含文本和图片URL）
        assistant_content = []
        if text_response:
            assistant_content.append({'type': 'text', 'text': text_response})
        
        if cos_url:
            assistant_content.append({'type': 'image_url', 'image_url': {'url': cos_url}})
            print(f"✅ 图片已转换为URL并加入历史")
        else:
            print(f"⚠️  URL转换失败，将使用Base64（可能导致上下文过大）")
            assistant_content.append({'type': 'image_url', 'image_url': {'url': base64_image}})
        
        # 添加assistant消息到历史
        messages_history.append({'role': 'assistant', 'content': assistant_content})
        
        print(f"📚 当前对话历史: {len(messages_history)} 条消息")
    
    print("\n" + "=" * 60)
    if start_mode == '2':
        print(f"🎉 多轮生成完成！共生成 {round_idx} 张图片")
    else:
        print(f"🎉 多轮生成完成！共生成 {round_idx - 1} 张图片")
    print(f"📁 图片保存位置: {pics_dir.absolute()}")
    print("=" * 60)

else:
    print("错误: 无效的模式选择，请输入 1、2 或 3")
    exit()