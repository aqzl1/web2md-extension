// src/background/service-worker.ts
import browser from 'webextension-polyfill';

// 扩展安装或更新时，创建右键菜单项
browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: 'convert-selection-to-markdown',
    title: '转换为 Markdown (Web2MD)',
    contexts: ['selection'], // 仅在选中文本时显示
  });
});

// 监听右键菜单点击事件
browser.contextMenus.onClicked.addListener(async (info, tab) => {
  console.log('[Web2MD] Menu clicked:', info.menuItemId, 'Selection:', info.selectionText?.substring(0, 50));

  if (info.menuItemId === 'convert-selection-to-markdown' && info.selectionText) {
    if (!tab?.id) {
      showNotification('错误', '无法获取当前标签页信息');
      return;
    }

    try {
      console.log('[Web2MD] Sending message to tab:', tab.id);

      // 向 content script 发送消息，转换选中的文本
      const response = await browser.tabs.sendMessage(tab.id, {
        action: 'convertAndCopySelection',
        selectionText: info.selectionText,
      });

      console.log('[Web2MD] Response from content script:', response);
      // 根据响应显示通知
      if (response?.success) {
        showNotification('Web2MD', '选中内容已转换为 Markdown 并复制到剪贴板！');
      } else {
        showNotification('Web2MD', '复制失败，请手动复制');
      }

    } catch (error: any) {
      console.error('Error sending message to content script:', error);
      
      if (error.message?.includes('Could not establish connection')) {
        try {
          console.log('[Web2MD] Injecting content script...');
          await browser.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content/content-script.js'],
          });
          
          // 等待一下再发送消息
          await new Promise(resolve => setTimeout(resolve, 100));
          
          const response = await browser.tabs.sendMessage(tab.id, {
            action: 'convertAndCopySelection',
            selectionText: info.selectionText,
          });
          
          console.log('[Web2MD] Response after injection:', response);
          
          if (response?.success) {
            showNotification('Web2MD', '选中内容已转换为 Markdown 并复制到剪贴板！');
          } else {
            showNotification('Web2MD', '复制失败，请手动复制');
          }
        } catch (retryError: any) {
          console.error('[Web2MD] Injection failed:', retryError);
          showNotification('Web2MD', '转换出错: 请刷新页面后重试');
        }
      } else {
        showNotification('Web2MD', `转换出错: ${error.message}`);
      }
    }
  }
});

// 辅助函数：显示浏览器通知
function showNotification(title: string, message: string) {
  browser.notifications.create({
    type: 'basic',
    iconUrl: browser.runtime.getURL('assets/icon-48.png'), // 确保路径正确
    title,
    message,
  });
}

// 监听来自 content script 的消息（复制结果通知）
// browser.runtime.onMessage.addListener((request, sender) => {
//   console.log('[Web2MD] Received message:', request);

//   if (request.action === 'copyResult') {
//     if (request.success) {
//       showNotification('Web2MD', '选中内容已转换为 Markdown 并复制到剪贴板！');
//     } else {
//       showNotification('Web2MD', '复制失败，请手动复制');
//     }
//   }

// });