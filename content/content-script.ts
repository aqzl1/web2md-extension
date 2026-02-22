// src/content/content-script.ts
import TurndownService from 'turndown';
import browser from 'webextension-polyfill';

console.log('[Web2MD] Content Script loaded');

// 监听来自 popup 或 background 的消息
browser.runtime.onMessage.addListener(async (request: any) => {
  console.log('[Web2MD] Content script received message:', request);

  try {
    // 转换整个页面
    if (request.action === 'convertPage') {
      const result = convertPageToMarkdown();
      console.log('[Web2MD] Convert page result:', result.markdown?.substring(0, 50));
      return result;
    }
    
    // 转换选中文本
    if (request.action === 'convertSelection') {
      const result = convertSelectionToMarkdown(request.selectionText);
      console.log('[Web2MD] Convert selection result:', result.markdown?.substring(0, 50));
      return result;
    }
    
    // 转换并复制选中文本（右键菜单使用）
    if (request.action === 'convertAndCopySelection') {
      console.log('[Web2MD] Converting and copying selection...');
      
      const result = convertSelectionToMarkdown(request.selectionText);
      console.log('[Web2MD] Converted markdown:', result.markdown?.substring(0, 50));
      
      // 复制到剪贴板
      const success = await copyToClipboard(result.markdown);
      console.log('[Web2MD] Copy result:', success);
      
      // 通知 background 显示通知
      // await browser.runtime.sendMessage({
      //   action: 'copyResult',
      //   success: success,
      // });
      
      return { success };
    }
    
    // 复制文本到剪贴板（通用）
    if (request.action === 'copyToClipboard') {
      console.log('[Web2MD] Copying to clipboard...');
      const success = await copyToClipboard(request.text);
      
      // await browser.runtime.sendMessage({
      //   action: 'copyResult',
      //   success: success,
      // });
      
      return { success };
    }
  } catch (err) {
    console.error('[Web2MD] Error processing message:', err);
    return { success: false, error: err };
  }
});

// 新增：剪贴板复制函数（降级方案）
async function copyToClipboard(text: string): Promise<boolean> {
  console.log('[Web2MD] Copying to clipboard, text length:', text.length);
  try {
    // 方案1: 尝试现代 Clipboard API
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      console.log('[Web2MD] Using Clipboard API');
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) {
    console.warn('Clipboard API failed, falling back to execCommand:', e);
  }
  
  // 方案2: 降级使用 document.execCommand（最兼容）
  try {
    console.log('[Web2MD] Using execCommand fallback');
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    
    console.log('[Web2MD] execCommand result:', successful);
    return successful;
  } catch (err) {
    console.error('execCommand copy failed:', err);
    return false;
  }
}


function convertPageToMarkdown() {
  // 1. 智能识别文章主体
  const articleContent = detectArticleContent();
  
  // 2. 配置 Turndown
  const turndown = new TurndownService({
    headingStyle: 'atx', // # 标题
    bulletListMarker: '-', // - 列表
    codeBlockStyle: 'fenced', // ``` 代码块
  });

  // 3. 移除不需要的元素 (导航、广告、脚本等)
  turndown.remove(['script', 'style', 'iframe', 'nav', 'footer', 'header', 'aside']);
  
  // 4. 执行转换
  const markdown = turndown.turndown(articleContent);
  
  // 5. 提取元数据
  const metadata = {
    title: document.title.trim(),
    url: window.location.href,
    date: new Date().toISOString().split('T')[0],
    author: extractAuthor(),
  };

  // 6. 生成带 Front Matter 的最终 Markdown
  const frontMatter = `---\ntitle: "${metadata.title}"\ndate: ${metadata.date}\nurl: ${metadata.url}\n---\n\n`;
  
  return { 
    markdown: frontMatter + markdown, 
    metadata 
  };
}

function convertSelectionToMarkdown(selectionText: string) {
  const turndown = new TurndownService({
    headingStyle: 'atx',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
  });
  
  // 创建一个临时元素来包裹选中的 HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = selectionText;
  
  const markdown = turndown.turndown(tempDiv);
  return { markdown };
}

// 智能识别文章主体内容
function detectArticleContent(): string {
  const selectors = [
    'article',
    '[role="article"]',
    '.post-content',
    '.article-content',
    '.entry-content',
    '#content',
    'main',
    '.post',
    '.article'
  ];
  
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      return element.innerHTML;
    }
  }
  
  // 如果没找到，降级处理：尝试移除常见非内容区域后返回 body
  const bodyClone = document.body.cloneNode(true) as HTMLElement;
  const elementsToRemove = bodyClone.querySelectorAll('nav, footer, header, aside, script, style');
  elementsToRemove.forEach(el => el.remove());
  
  return bodyClone.innerHTML;
}

function extractAuthor(): string {
  // 尝试从 meta 标签或特定选择器提取作者
  const metaAuthor = document.querySelector('meta[name="author"]') as HTMLMetaElement;
  if (metaAuthor && metaAuthor.content) {
    return metaAuthor.content;
  }
  
  const byLine = document.querySelector('.byline, .author, .post-author');
  if (byLine) {
    return byLine.textContent?.trim() || '';
  }
  
  return '';
}