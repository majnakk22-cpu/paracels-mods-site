// Блоки-выноски в Markdown в стиле GitHub:
//   > [!NOTE] Заголовок (необязательно)
//   > Текст...
// Типы: NOTE, TIP, WARNING, DANGER, LORE
const LABELS = {
  note: 'Заметка',
  tip: 'Совет',
  warning: 'Внимание',
  danger: 'Опасно',
  lore: 'Из архива',
};

function walk(node, fn) {
  fn(node);
  if (node.children) for (const c of node.children) walk(c, fn);
}

export default function remarkCallouts() {
  return (tree) => {
    walk(tree, (node) => {
      if (node.type !== 'blockquote') return;
      const first = node.children?.[0];
      if (!first || first.type !== 'paragraph') return;
      const text = first.children?.[0];
      if (!text || text.type !== 'text') return;
      const m = text.value.match(/^\[!(\w+)\][ \t]*([^\n]*)\n?/);
      if (!m) return;
      const type = m[1].toLowerCase();
      const title = m[2].trim() || LABELS[type] || m[1];
      text.value = text.value.slice(m[0].length);
      if (!text.value) first.children.shift();
      if (first.children.length === 0) node.children.shift();
      node.data = { hName: 'div', hProperties: { className: ['callout', `callout-${type}`] } };
      node.children.unshift({
        type: 'paragraph',
        data: { hProperties: { className: ['callout-title'] } },
        children: [{ type: 'text', value: title }],
      });
    });
  };
}
