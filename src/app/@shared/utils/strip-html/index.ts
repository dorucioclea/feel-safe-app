export function stripHtml(content: string) {
  if (!content) { return '' };

  const tmp = document.implementation.createHTMLDocument('New').body;
  tmp.innerHTML = content;

  return tmp.textContent || tmp.innerText || '';
}
