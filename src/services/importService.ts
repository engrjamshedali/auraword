/**
 * Import Service for AuraWord
 * Parses DOCX files via mammoth, plus TXT and HTML.
 */

import mammoth from 'mammoth';

export interface ImportedDocumentData {
  title: string;
  content: string;
}

/**
 * Parse an uploaded file into document title and HTML content
 */
export async function parseUploadedFile(file: File): Promise<ImportedDocumentData> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  const rawTitle = file.name.replace(/\.[^/.]+$/, '');

  if (extension === 'docx') {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.convertToHtml({ arrayBuffer });
    return {
      title: rawTitle,
      content: result.value || '<p>Empty DOCX document</p>',
    };
  } else if (extension === 'html' || extension === 'htm') {
    const text = await file.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const bodyContent = doc.body.innerHTML || text;
    return {
      title: rawTitle,
      content: bodyContent,
    };
  } else if (extension === 'txt') {
    const text = await file.text();
    // Convert newlines to paragraphs
    const paragraphs = text
      .split(/\r?\n\r?\n/)
      .map(p => `<p>${escapeHtml(p.trim()).replace(/\r?\n/g, '<br />')}</p>`)
      .join('\n');
    return {
      title: rawTitle,
      content: paragraphs || '<p></p>',
    };
  } else {
    throw new Error(`Unsupported file type: .${extension}. AuraWord supports .docx, .html, and .txt.`);
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
