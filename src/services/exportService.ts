/**
 * Export Service for AuraWord
 * Handles high-fidelity export to DOCX, PDF, HTML, and TXT.
 */

import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { DocumentRecord } from '../types/document';

/**
 * Trigger browser file download from Blob
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export document to authentic Microsoft Word .docx file using 'docx' library
 */
export async function exportToDocx(doc: DocumentRecord): Promise<void> {
  const parser = new DOMParser();
  const htmlDoc = parser.parseFromString(doc.content, 'text/html');
  const body = htmlDoc.body;

  const docxParagraphs: Paragraph[] = [];

  // Parse DOM nodes to DOCX elements
  for (const node of Array.from(body.childNodes)) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tagName = el.tagName.toLowerCase();

      if (tagName === 'h1') {
        docxParagraphs.push(
          new Paragraph({
            text: el.textContent || '',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 },
          })
        );
      } else if (tagName === 'h2') {
        docxParagraphs.push(
          new Paragraph({
            text: el.textContent || '',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          })
        );
      } else if (tagName === 'h3') {
        docxParagraphs.push(
          new Paragraph({
            text: el.textContent || '',
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 160, after: 80 },
          })
        );
      } else if (tagName === 'ul') {
        const lis = el.querySelectorAll('li');
        lis.forEach(li => {
          docxParagraphs.push(
            new Paragraph({
              text: li.textContent || '',
              bullet: { level: 0 },
              spacing: { after: 60 },
            })
          );
        });
      } else if (tagName === 'ol') {
        const lis = el.querySelectorAll('li');
        lis.forEach((li) => {
          docxParagraphs.push(
            new Paragraph({
              text: li.textContent || '',
              bullet: { level: 0 },
              spacing: { after: 60 },
            })
          );
        });
      } else if (tagName === 'p' || tagName === 'div') {
        // Parse child spans for bold, italic, underline
        const runs: TextRun[] = [];
        if (el.childNodes.length === 0) {
          runs.push(new TextRun({ text: el.textContent || '' }));
        } else {
          el.childNodes.forEach((child) => {
            if (child.nodeType === Node.TEXT_NODE) {
              runs.push(new TextRun({ text: child.textContent || '' }));
            } else if (child.nodeType === Node.ELEMENT_NODE) {
              const childEl = child as HTMLElement;
              const isBold = childEl.tagName === 'STRONG' || childEl.tagName === 'B' || childEl.style.fontWeight === 'bold';
              const isItalic = childEl.tagName === 'EM' || childEl.tagName === 'I' || childEl.style.fontStyle === 'italic';
              const isUnderline = childEl.tagName === 'U' || childEl.style.textDecoration?.includes('underline');
              runs.push(
                new TextRun({
                  text: childEl.textContent || '',
                  bold: isBold,
                  italics: isItalic,
                  underline: isUnderline ? {} : undefined,
                })
              );
            }
          });
        }

        let alignment: (typeof AlignmentType)[keyof typeof AlignmentType] = AlignmentType.LEFT;
        if (el.style.textAlign === 'center') alignment = AlignmentType.CENTER;
        if (el.style.textAlign === 'right') alignment = AlignmentType.RIGHT;
        if (el.style.textAlign === 'justify') alignment = AlignmentType.JUSTIFIED;

        docxParagraphs.push(
          new Paragraph({
            children: runs.length > 0 ? runs : [new TextRun({ text: el.textContent || '' })],
            alignment,
            spacing: { after: 120 },
          })
        );
      }
    }
  }

  // Fallback if empty
  if (docxParagraphs.length === 0) {
    docxParagraphs.push(
      new Paragraph({
        children: [new TextRun({ text: doc.title })],
      })
    );
  }

  const docxFile = new Document({
    creator: doc.author || 'AuraWord',
    title: doc.title,
    description: 'Document created with AuraWord',
    sections: [
      {
        properties: {},
        children: docxParagraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(docxFile);
  const cleanTitle = (doc.title || 'Document').replace(/[^a-zA-Z0-9_\- ]/g, '_');
  downloadBlob(blob, `${cleanTitle}.docx`);
}

/**
 * Export document to PDF using html2canvas & jsPDF
 */
export async function exportToPdf(doc: DocumentRecord, pageElementId: string = 'auraword-pages-container'): Promise<void> {
  const container = document.getElementById(pageElementId);
  if (!container) {
    window.print();
    return;
  }

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: doc.pageSetup.orientation === 'landscape' ? 'landscape' : 'portrait',
      unit: 'mm',
      format: doc.pageSetup.paperSize === 'A4' ? 'a4' : 'letter',
    });

    const imgWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const cleanTitle = (doc.title || 'Document').replace(/[^a-zA-Z0-9_\- ]/g, '_');
    pdf.save(`${cleanTitle}.pdf`);
  } catch (err) {
    console.error('PDF export failed, falling back to print dialog:', err);
    window.print();
  }
}

/**
 * Export document to styled HTML
 */
export function exportToHtml(doc: DocumentRecord): void {
  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(doc.title)}</title>
  <style>
    body {
      font-family: ${doc.theme.fontFamily};
      line-height: ${doc.theme.lineSpacing};
      color: #1f2937;
      max-width: 800px;
      margin: 40px auto;
      padding: 40px;
      background: ${doc.theme.pageColor};
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    h1, h2, h3, h4 {
      font-family: ${doc.theme.headingFont};
      color: ${doc.theme.primaryColor};
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 8px 12px;
    }
    th {
      background-color: #f1f5f9;
    }
  </style>
</head>
<body>
  ${doc.content}
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
  const cleanTitle = (doc.title || 'Document').replace(/[^a-zA-Z0-9_\- ]/g, '_');
  downloadBlob(blob, `${cleanTitle}.html`);
}

/**
 * Export document to Plain Text (.txt)
 */
export function exportToTxt(doc: DocumentRecord): void {
  const div = document.createElement('div');
  div.innerHTML = doc.content;
  const textContent = div.innerText || div.textContent || '';
  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
  const cleanTitle = (doc.title || 'Document').replace(/[^a-zA-Z0-9_\- ]/g, '_');
  downloadBlob(blob, `${cleanTitle}.txt`);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
