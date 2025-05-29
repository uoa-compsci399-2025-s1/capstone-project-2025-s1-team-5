import sanitizeHtml from 'sanitize-html';

export function cleanHtml(raw: string): string {
  return sanitizeHtml(raw, {
    allowedTags: ['p','h1','h2','h3','h4','h5','h6','strong','em','img','iframe'],
    allowedAttributes: {
      img: ['src','alt','width','height'],
      iframe: ['src','frameborder','allow','allowfullscreen'],
    },
  });
}
