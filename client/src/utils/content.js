export const getPublicApiBase = () => {
  const raw = import.meta.env.VITE_API_URL || '/api';
  return raw.replace(/\/api\/?$/, '');
};

export const resolveContentImage = (value) => {
  if (!value) return '';
  if (/^https?:\/\//i.test(value) || value.startsWith('data:')) return value;
  if (value.startsWith('/uploads/')) return `${getPublicApiBase()}${value}`;
  return value;
};

export const renderSimpleMarkdownBlocks = (contentMarkdown = '') => {
  const lines = String(contentMarkdown || '').split(/\r?\n/);
  const blocks = [];
  let paragraphLines = [];
  let listItems = [];

  const flushParagraph = () => {
    if (!paragraphLines.length) return;
    blocks.push({
      type: 'paragraph',
      content: paragraphLines.join(' ').trim()
    });
    paragraphLines = [];
  };

  const flushList = () => {
    if (!listItems.length) return;
    blocks.push({
      type: 'list',
      items: [...listItems]
    });
    listItems = [];
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      return;
    }

    if (line.startsWith('### ')) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'h3', content: line.slice(4).trim() });
      return;
    }

    if (line.startsWith('## ')) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'h2', content: line.slice(3).trim() });
      return;
    }

    if (line.startsWith('- ')) {
      flushParagraph();
      listItems.push(line.slice(2).trim());
      return;
    }

    flushList();
    paragraphLines.push(line);
  });

  flushParagraph();
  flushList();

  return blocks;
};
