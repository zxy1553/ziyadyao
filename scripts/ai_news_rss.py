import urllib.request
import xml.etree.ElementTree as ET
import ssl
import webbrowser
import os
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime

# 忽略 SSL 证书验证
ssl._create_default_https_context = ssl._create_unverified_context

def parse_date(date_str):
    """尝试解析多种格式的日期字符串，返回带时区的 datetime 对象"""
    if not date_str:
        return None
    
    try:
        # 尝试解析 RFC 822 (RSS 标准格式)
        return parsedate_to_datetime(date_str)
    except:
        pass
        
    try:
        # 尝试解析 ISO 8601 (Atom 标准格式)
        # 处理 Python < 3.11 对 ISO 格式支持不全的问题，简单处理 'Z'
        if date_str.endswith('Z'):
            date_str = date_str[:-1] + '+00:00'
        return datetime.fromisoformat(date_str)
    except:
        pass
        
    return None

def get_rss_feed(url, source_name):
    print(f"正在获取 {source_name} 的最新资讯...")
    articles = []
    try:
        # 增强 Headers 模拟真实浏览器，防止被拦截
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        }
        req = urllib.request.Request(url, headers=headers)
        
        with urllib.request.urlopen(req, timeout=15) as response:
            xml_content = response.read()
            
        root = ET.fromstring(xml_content)
        
        # 兼容 RSS 和 Atom 两种格式
        items = root.findall('.//item')
        if not items:
            ns = {'atom': 'http://www.w3.org/2005/Atom'}
            items = root.findall('atom:entry', ns)
            
        current_time = datetime.now(timezone.utc)
        
        for item in items[:5]: # 每个源只取最新 5 条
            title = item.find('title')
            link = item.find('link')
            pubDate = item.find('pubDate')
            
            # 处理 Atom 格式的特殊字段
            link_text = link.text if link is not None and link.text else ""
            if not link_text and link is not None:
                link_text = link.get('href')
            
            title_text = title.text if title is not None else "无标题"
            
            # 尝试获取时间
            date_text = ""
            dt_object = None
            
            if pubDate is not None:
                date_text = pubDate.text
            else:
                ns = {'atom': 'http://www.w3.org/2005/Atom'}
                published = item.find('atom:published', ns)
                if published is None:
                    published = item.find('atom:updated', ns)
                if published is not None:
                    date_text = published.text

            # 解析日期并判断是否为最近 3 天
            is_new = False
            if date_text:
                dt_object = parse_date(date_text)
                if dt_object:
                    # 如果没有时区信息，假定为 UTC
                    if dt_object.tzinfo is None:
                        dt_object = dt_object.replace(tzinfo=timezone.utc)
                    
                    # 判断是否在最近 3 天内 (72小时)
                    if (current_time - dt_object) < timedelta(hours=72):
                        is_new = True
                    
                    # 格式化显示时间
                    date_text = dt_object.strftime('%Y-%m-%d')

            articles.append({
                'title': title_text,
                'link': link_text,
                'date': date_text,
                'is_new': is_new
            })
            
    except Exception as e:
        print(f"获取 {source_name} 失败: {e}")
        
    return articles

def generate_html(all_news):
    html_content = f"""
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI 巨头最新资讯汇总</title>
        <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; background-color: #f5f5f7; }}
            h1 {{ text-align: center; color: #1a1a1a; margin-bottom: 10px; }}
            .subtitle {{ text-align: center; color: #666; margin-bottom: 30px; font-size: 0.9em; }}
            .source-section {{ background: white; border-radius: 12px; padding: 20px; margin-bottom: 25px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }}
            .source-title {{ font-size: 1.4em; font-weight: bold; color: #0066cc; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px; margin-bottom: 15px; display: flex; align-items: center; justify-content: space-between; }}
            .article-list {{ list-style: none; padding: 0; }}
            .article-item {{ margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee; display: flex; align-items: flex-start; }}
            .article-item:last-child {{ border-bottom: none; margin-bottom: 0; padding-bottom: 0; }}
            .article-content {{ flex-grow: 1; }}
            .article-link {{ text-decoration: none; color: #2c3e50; font-weight: 500; font-size: 1.1em; display: block; margin-bottom: 4px; }}
            .article-link:hover {{ color: #0066cc; }}
            .article-date {{ font-size: 0.85em; color: #888; }}
            .new-badge {{ background-color: #ff3b30; color: white; font-size: 0.7em; padding: 2px 6px; border-radius: 4px; font-weight: bold; margin-left: 8px; vertical-align: middle; display: inline-block; }}
            .footer {{ text-align: center; margin-top: 40px; color: #999; font-size: 0.9em; }}
            .summary-box {{ background: #e8f4fd; border: 1px solid #b6dcfb; border-radius: 8px; padding: 15px; margin-bottom: 30px; text-align: center; }}
            .summary-text {{ color: #005299; font-weight: 500; }}
        </style>
    </head>
    <body>
        <h1>🤖 AI 巨头最新资讯汇总</h1>
        <p class="subtitle">生成时间: {datetime.now().strftime('%Y-%m-%d %H:%M')}</p>
    """
    
    # 统计新文章数量
    total_new = sum(1 for articles in all_news.values() for a in articles if a['is_new'])
    
    if total_new > 0:
        html_content += f"""
        <div class="summary-box">
            <div class="summary-text">🔥 发现 {total_new} 篇最近 3 天内发布的文章，已为您高亮显示！</div>
        </div>
        """
    else:
        html_content += f"""
        <div class="summary-box" style="background: #f0f0f0; border-color: #ddd;">
            <div class="summary-text" style="color: #666;">☕ 最近 3 天暂无重大更新，您可以安心喝咖啡了。</div>
        </div>
        """
    
    for source, articles in all_news.items():
        if not articles: continue
        
        # 检查该源是否有新文章
        has_new = any(a['is_new'] for a in articles)
        source_style = 'color: #0066cc;' if has_new else 'color: #666;'
        
        html_content += f"""
        <div class="source-section">
            <div class="source-title" style="{source_style}">
                {source}
                {'<span class="new-badge">UPDATED</span>' if has_new else ''}
            </div>
            <ul class="article-list">
        """
        
        for article in articles:
            new_tag = '<span class="new-badge">NEW</span>' if article['is_new'] else ''
            # 如果是新文章，标题加粗显示
            link_style = 'font-weight: bold;' if article['is_new'] else 'font-weight: normal;'
            
            html_content += f"""
                <li class="article-item">
                    <div class="article-content">
                        <a href="{article['link']}" class="article-link" style="{link_style}" target="_blank">
                            {article['title']} {new_tag}
                        </a>
                        <div class="article-date">{article['date']}</div>
                    </div>
                </li>
            """
        html_content += '</ul></div>'
        
    html_content += '<div class="footer">Generated by AI News RSS Script</div></body></html>'
    return html_content

if __name__ == "__main__":
    # 定义一些优质的 AI RSS 源
    # 部分源使用 Google News RSS 代理以确保稳定性（避免 403/400 错误）
    feeds = [
        ("OpenAI Blog", "https://openai.com/blog/rss.xml"),
        ("Google AI Blog", "https://blog.google/technology/ai/rss/"),
        ("Microsoft AI", "https://blogs.microsoft.com/ai/feed/"),
        # Meta AI 官网 RSS 较难抓取，使用 Google News 代理
        ("Meta AI Blog", "https://news.google.com/rss/search?q=site:ai.meta.com/blog&hl=en-US&gl=US&ceid=US:en"),
        ("Hugging Face Blog", "https://huggingface.co/blog/feed.xml"),
        # Anthropic 没有官方 RSS，使用 Google News 代理
        ("Anthropic (Claude)", "https://news.google.com/rss/search?q=site:anthropic.com/news&hl=en-US&gl=US&ceid=US:en"),
    ]

    print("=== AI 资讯简易抓取器 (升级版) ===")
    print("正在抓取最新资讯，请稍候...")
    
    all_news = {}
    for name, url in feeds:
        articles = get_rss_feed(url, name)
        if articles:
            all_news[name] = articles
            print(f"✅ {name}: 获取到 {len(articles)} 篇文章")
        else:
            print(f"❌ {name}: 未获取到文章")

    # 生成 HTML 文件
    html_content = generate_html(all_news)
    # 使用 index.html 作为文件名，方便部署到 GitHub Pages 等静态托管服务
    file_path = os.path.abspath("index.html")
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(html_content)
        
    print(f"\n🎉 报告已生成: {file_path}")
    print("正在自动打开浏览器...")
    
    # 自动打开浏览器
    webbrowser.open('file://' + file_path)
