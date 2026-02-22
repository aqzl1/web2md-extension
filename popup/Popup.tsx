import React, { useState } from 'react';
import browser from 'webextension-polyfill'; // 建议安装此包以获得更好的类型支持和兼容性
import { MessageResponse } from '../types/messages';

// 如果没有安装 webextension-polyfill，可以使用 globalThis.browser 或 chrome
// const browser = globalThis.browser || globalThis.chrome; 

interface Metadata {
  title: string;
  url: string;
  date: string;
  author?: string;
}

export default function Popup() {
  const [loading, setLoading] = useState(false);
  const [markdown, setMarkdown] = useState<string>('');
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async () => {
    setLoading(true);
    setError(null);
    setMarkdown('');
    setMetadata(null);

    try {
      // 获取当前活动标签页
      const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
      
      if (!tab.id) {
        throw new Error('无法获取当前标签页');
      }

      // 向 content script 发送转换消息
      const response = await browser.tabs.sendMessage(tab.id, { action: 'convertPage' }) as MessageResponse;
      
      if (response && response.markdown) {
        setMarkdown(response.markdown);
        setMetadata(response.metadata as Metadata | null);
      } else {
        throw new Error('转换失败，未收到有效响应');
      }
    } catch (err: any) {
      console.error('Conversion error:', err);
      setError(err.message || '转换过程中发生错误');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!markdown) return;
    
    try {
      // 方案1: 现代 Clipboard API
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(markdown);
        alert('Markdown 已复制到剪贴板！');
        return;
      }
      
      // 方案2: 降级方案 - document.execCommand
      const textarea = document.createElement('textarea');
      textarea.value = markdown;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      textarea.style.left = '-9999px';
      textarea.style.top = '0';
      document.body.appendChild(textarea);
      textarea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);
      
      if (successful) {
        alert('Markdown 已复制到剪贴板！');
      } else {
        throw new Error('execCommand copy failed');
      }
    } catch (err) {
      console.error('Copy failed:', err);
      alert('复制失败，请手动复制。');
    }
  };

  const handleDownload = () => {
    if (!markdown || !metadata) return;

    // 生成文件名: {日期}-{标题}.md
    const safeTitle = metadata.title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_').substring(0, 50);
    const filename = `${metadata.date}-${safeTitle}.md`;

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    browser.downloads.download({
      url,
      filename,
      saveAs: true, // 让用户选择保存位置
    }).catch(err => {
      console.error('Download failed:', err);
      alert('下载失败');
    });
    
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ width: '350px', padding: '15px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#333' }}>📝 Web2MD</h2>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>
          ❌ {error}
        </div>
      )}

      {!loading && !markdown && !error && (
        <button 
          onClick={handleConvert} 
          style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
        >
          ✨ 转换当前页面
        </button>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>正在转换...</p>
        </div>
      )}

      {markdown && (
        <div>
          <div style={{ marginBottom: '10px', fontSize: '14px', color: '#555' }}>
            <strong>标题:</strong> {metadata?.title}
          </div>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <button 
              onClick={handleCopy}
              style={{ flex: 1, padding: '8px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
            >
              📋 复制
            </button>
            <button 
              onClick={handleDownload}
              style={{ flex: 1, padding: '8px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
            >
              💾 下载
            </button>
          </div>

          <details>
            <summary style={{ cursor: 'pointer', fontSize: '13px', color: '#007bff' }}>预览 Markdown</summary>
            <textarea 
              readOnly 
              value={markdown} 
              style={{ width: '100%', height: '200px', marginTop: '10px', fontSize: '12px', fontFamily: 'monospace', padding: '5px', boxSizing: 'border-box' }}
            />
          </details>
          
          <button 
            onClick={() => { setMarkdown(''); setMetadata(null); }}
            style={{ marginTop: '10px', width: '100%', padding: '8px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
          >
            关闭
          </button>
        </div>
      )}
    </div>
  );
}