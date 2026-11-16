import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Copy, Check, Download, FileCode, CheckCircle, ExternalLink } from 'lucide-react';

export const BloggerExportModal: React.FC = () => {
  const { isBloggerExportOpen, setIsBloggerExportOpen, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'netlify' | 'blogger'>('netlify');
  const [copied, setCopied] = useState(false);

  if (!isBloggerExportOpen) return null;

  const netlifyRedirects = `# Netlify Single Page Application (SPA) & Static Redirects
/*    /index.html   200
`;

  const netlifyToml = `[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`;

  const bloggerTemplateXML = `<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE html>
<html xmlns='http://www.w3.org/1999/xhtml' xmlns:b='http://www.google.com/2005/gml/b' xmlns:data='http://www.google.com/2005/gml/data' xmlns:expr='http://www.google.com/2005/gml/expr'>
<head>
  <meta charset='utf-8'/>
  <meta content='width=device-width, initial-scale=1.0' name='viewport'/>
  <title><data:blog.pageTitle/></title>
  <b:include data='blog' name='all-head-content'/>

  <!-- Primary Dynamic SEO Meta -->
  <meta content='Watch movies and TV shows online discovery guide with cast, trailers, and ratings.' name='description'/>
  <meta content='index, follow, max-image-preview:large' name='robots'/>
  <link expr:href='data:blog.canonicalUrl' rel='canonical'/>

  <!-- Google Fonts & Icons -->
  <link href='https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&amp;display=swap' rel='stylesheet'/>
  <link href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css' rel='stylesheet'/>

  <b:skin><![CDATA[
    /* Streamzy OTT Dark Style */
    :root {
      --bg-base: #060608;
      --bg-surface: #0e0e12;
      --brand-primary: #00ACC1;
      --brand-accent: #00D4FF;
      --text-primary: #FFFFFF;
      --text-secondary: #b3b3c4;
    }
    body { background: var(--bg-base); color: var(--text-primary); font-family: 'Outfit', sans-serif; margin: 0; }
    a { text-decoration: none; color: inherit; }
  ]]></b:skin>
</head>
<body>
  <!-- Required Blogger Header Section -->
  <b:section class='header' id='header' maxwidgets='1' showaddelement='no'>
    <b:widget id='Header1' locked='true' title='Streamzy' type='Header'/>
  </b:section>

  <!-- Main Content Area -->
  <b:section class='main' id='main' showaddelement='yes'>
    <b:widget id='Blog1' locked='true' title='Blog Posts' type='Blog'/>
  </b:section>

  <!-- Crawlable SEO Nav & Footer Section -->
  <footer class='fm-footer'>
    <div class='container'>
      <p>&#169; 2026 Streamzy. Official Movie &amp; TV Discovery Guide.</p>
    </div>
  </footer>
</body>
</html>`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Code copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}`, 'info');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl bg-[#0f0f15] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-zinc-950">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Export & Deployment Architecture</h3>
          </div>
          <button
            onClick={() => setIsBloggerExportOpen(false)}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/10 px-6 bg-zinc-900/40">
          <button
            type="button"
            onClick={() => setActiveTab('netlify')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'netlify'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Netlify Ready Config (_redirects & toml)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('blogger')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'blogger'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Refactored Blogger XML Template
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {activeTab === 'netlify' ? (
            <div className="space-y-4 text-sm text-zinc-300">
              <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-xs leading-relaxed space-y-1.5">
                <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-cyan-400" /> Netlify Deployment Status: 100% Configured
                </div>
                <p>
                  This project contains <code>public/_redirects</code> and <code>netlify.toml</code> configured with rewrite rules (<code>/* /index.html 200</code>) to ensure all deep SEO routes (e.g. <code>/movie/slug</code>, <code>/genres/action</code>, <code>/year/2026</code>) load seamlessly without 404 errors when deployed to Netlify.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-zinc-400">public/_redirects</span>
                  <button
                    onClick={() => copyToClipboard(netlifyRedirects)}
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                </div>
                <pre className="p-3 rounded-lg bg-black text-xs font-mono text-cyan-300 border border-white/5">
                  {netlifyRedirects}
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-zinc-400">netlify.toml</span>
                  <button
                    onClick={() => copyToClipboard(netlifyToml)}
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                </div>
                <pre className="p-3 rounded-lg bg-black text-xs font-mono text-cyan-300 border border-white/5">
                  {netlifyToml}
                </pre>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-zinc-300 leading-relaxed">
                Here is the verified Blogger XML template with valid XML tags, escaped entities (<code>&amp;amp;</code>), CDATA wrappers, and crawlable structure ready to paste directly into Blogger Theme Editor if desired:
              </p>

              <div className="relative">
                <pre className="p-4 rounded-xl bg-black text-[11px] font-mono text-zinc-300 border border-white/10 max-h-72 overflow-y-auto whitespace-pre-wrap">
                  {bloggerTemplateXML}
                </pre>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => copyToClipboard(bloggerTemplateXML)}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy Blogger XML'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => downloadFile('fmovies-streamzy-blogger-theme.xml', bloggerTemplateXML)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-colors border border-white/10"
                >
                  <Download className="w-4 h-4" /> Download XML
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-zinc-950 flex justify-end">
          <button
            type="button"
            onClick={() => setIsBloggerExportOpen(false)}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
