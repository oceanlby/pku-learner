const host = 'https://github.com/oceanlby/pku-learner';
const panel = document.getElementById('release');

function node(tag, text, className) {
  const element = document.createElement(tag);
  if (text) element.textContent = text;
  if (className) element.className = className;
  return element;
}

function assetLabel(name) {
  if (/\.exe$/i.test(name)) return 'Windows x64';
  if (/\.dmg$/i.test(name)) return `macOS · ${/arm64/i.test(name) ? 'Apple 芯片' : 'Intel'}`;
  if (/\.AppImage$/i.test(name)) return 'Linux · AppImage';
  if (/\.deb$/i.test(name)) return 'Linux · DEB';
  return '';
}

function verifiedAsset(asset) {
  return typeof asset?.name === 'string' && typeof asset.browser_download_url === 'string'
    && asset.browser_download_url.startsWith(`${host}/releases/download/`);
}

function renderRelease(info) {
  const assets = Array.isArray(info?.assets) ? info.assets.filter(verifiedAsset) : [];
  const installers = assets.filter(({ name }) => assetLabel(name));
  const link = node('a', '查看发布记录');
  link.href = `${host}/releases`;
  if (!installers.length) {
    panel.replaceChildren(node('p', '目前暂无公开发布的安装包。'), link);
    return;
  }
  const title = node('div', '', 'release-top');
  title.append(node('strong', `最新版本 ${String(info.tag_name).replace(/^v/, '')}`), link);
  const list = node('div', '', 'release-list');
  for (const { name, browser_download_url, size } of installers) {
    const label = assetLabel(name);
    const file = node('a', label, `button${label.startsWith('Windows') ? ' primary' : ''}`);
    file.href = browser_download_url;
    if (Number.isFinite(size) && size > 0) file.append(node('small', `${(size / 1e6).toFixed(0)} MB`));
    list.append(file);
  }
  panel.replaceChildren(title, list);
  const checksums = assets.find(({ name }) => name === 'SHA256SUMS.txt');
  if (checksums) {
    const checksumLink = node('a', 'SHA-256 校验文件');
    checksumLink.href = checksums.browser_download_url;
    panel.append(checksumLink);
  }
}

try {
  const response = await fetch('./latest.json', { cache: 'no-store' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  renderRelease(await response.json());
} catch {
  const link = node('a', '前往 GitHub Releases');
  link.href = `${host}/releases`;
  panel.replaceChildren(node('p', '暂时无法读取发布信息。'), link);
}
