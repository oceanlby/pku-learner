const views = {
  library: {
    alt: 'PKU Learner 教学网的学期选择、课程导航和当前课程资料',
    detail: '置顶常用课程，按课件、作业附件、课堂实录和笔记查看资料。',
  },
  search: {
    alt: '本学期资料搜索结果，列出资料名称、所属课程和类别',
    detail: '输入课程名或文件名中的词，跨课查找本学期的课件、作业附件、实录和笔记。',
  },
  reader: {
    alt: 'Markdown 笔记阅读器中的正文查找、匹配数量和关键词高亮',
    detail: '在笔记或语音转写里查找原文，用 Enter 和 Shift+Enter 在高亮结果之间切换。',
  },
  history: {
    alt: '教学网任务历史记录，按课程和状态筛选下载、批次与笔记任务',
    detail: '在任务历史中按课程和状态定位记录，找到失败的附件后直接重试。',
  },
};

const links = document.querySelectorAll('.shot-switch a');
const image = document.getElementById('product-shot');
const full = document.getElementById('shot-full');
const original = document.getElementById('shot-original');
const description = document.getElementById('shot-description');

for (const link of links) {
  link.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const view = views[link.dataset.shot];
    if (!view) return;
    event.preventDefault();
    for (const item of links) {
      item.classList.toggle('active', item === link);
      if (item === link) item.setAttribute('aria-current', 'true');
      else item.removeAttribute('aria-current');
    }
    image.src = link.href;
    image.alt = view.alt;
    original.href = full.href = link.href;
    full.setAttribute('aria-label', `查看${link.textContent}原图`);
    description.textContent = view.detail;
  });
}
