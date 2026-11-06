/**
 * Pure document logic functions for AuraWord.
 * Decoupled from React and DOM for reliable unit-testing and fast computation.
 */

import { CitationSource, CitationStyle, MailMergeContact, PaperSize, PageOrientation, DocumentStats } from '../types/document';

/**
 * Calculate detailed document statistics from raw text or HTML
 */
export function calculateDocumentStats(rawContent: string, pageCount: number = 1): DocumentStats {
  // Strip HTML tags for clean text analysis
  const text = rawContent.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

  if (!text) {
    return {
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      paragraphs: 0,
      pages: Math.max(1, pageCount),
      readingTimeMinutes: 0,
      fleschScore: 100,
    };
  }

  // Count words by unicode-aware word boundaries
  const wordsArray = text.match(/[\p{L}\p{N}'’]+/gu) || [];
  const words = wordsArray.length;

  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;

  // Count paragraphs from HTML block tags or newlines
  const paragraphMatches = rawContent.match(/<(p|h[1-6]|li|tr)[^>]*>.*?<\/\1>/gi);
  const paragraphs = paragraphMatches && paragraphMatches.length > 0
    ? paragraphMatches.length
    : text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length || 1;

  // Approximate Reading time: 200 words per minute average
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

  // Count sentences
  const sentenceMatches = text.match(/[^.!?]+[.!?]+(\s|$)/g) || [text];
  const sentenceCount = Math.max(1, sentenceMatches.length);

  // Approximate syllable count for Flesch Reading Ease
  let syllables = 0;
  for (const word of wordsArray) {
    syllables += countSyllables(word.toLowerCase());
  }
  const avgSentenceLength = words / sentenceCount;
  const avgSyllablesPerWord = words > 0 ? syllables / words : 1;

  // Flesch Reading Ease score = 206.835 - (1.015 * ASL) - (84.6 * ASW)
  let fleschScore = Math.round(206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord));
  if (fleschScore < 0) fleschScore = 0;
  if (fleschScore > 100) fleschScore = 100;

  return {
    words,
    characters,
    charactersNoSpaces,
    paragraphs,
    pages: Math.max(1, pageCount),
    readingTimeMinutes,
    fleschScore,
  };
}

/**
 * Simple English syllable estimator
 */
export function countSyllables(word: string): number {
  if (word.length <= 3) return 1;
  const cleaned = word.replace(/(?:[^laeiouy]|ed|es|e)$/, '').replace(/^y/, '');
  const matches = cleaned.match(/[aeiouy]{1,2}/g);
  return matches ? Math.max(1, matches.length) : 1;
}

/**
 * Perform text case conversion
 */
export type TextCase = 'sentence' | 'lowercase' | 'uppercase' | 'title' | 'toggle';

export function convertTextCase(text: string, targetCase: TextCase): string {
  switch (targetCase) {
    case 'lowercase':
      return text.toLowerCase();
    case 'uppercase':
      return text.toUpperCase();
    case 'sentence':
      return text.toLowerCase().replace(/(^\s*|[.!?]\s+)(\p{L})/gu, (_, prefix, char) => prefix + char.toUpperCase());
    case 'title':
      return text.toLowerCase().replace(/\b(\p{L})/gu, (char) => char.toUpperCase());
    case 'toggle':
      return text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('');
    default:
      return text;
  }
}

/**
 * Format a citation in various academic styles
 */
export function formatCitation(source: CitationSource, style: CitationStyle): string {
  const author = source.authors || 'Unknown';
  const year = source.year || 'n.d.';
  const title = source.title || 'Untitled';
  const pub = source.publisher || source.journal || '';

  switch (style) {
    case 'APA':
      return `${author} (${year}). ${title}.${pub ? ` ${pub}.` : ''}`;
    case 'MLA':
      return `${author}. "${title}." ${pub ? `${pub}, ` : ''}${year}.`;
    case 'Chicago':
      return `${author}. ${title}. ${pub ? `${pub}, ` : ''}${year}.`;
    case 'IEEE':
      return `[${source.key || '1'}] ${author}, "${title}", ${pub ? `${pub}, ` : ''}${year}.`;
    default:
      return `${author} (${year}). ${title}.`;
  }
}

/**
 * Extract Table of Contents entries from HTML content
 */
export interface TocItem {
  id: string;
  level: number;
  text: string;
  tag: string;
}

export function extractTableOfContents(html: string): TocItem[] {
  const regex = /<(h[1-3])([^>]*)>(.*?)<\/\1>/gi;
  const items: TocItem[] = [];
  let match;
  let index = 0;

  while ((match = regex.exec(html)) !== null) {
    index++;
    const tag = match[1].toLowerCase();
    const level = parseInt(tag.replace('h', ''), 10);
    const attributes = match[2];
    const innerHtml = match[3];

    // Strip any nested tags inside heading
    const text = innerHtml.replace(/<[^>]*>/g, '').trim();

    // Look for existing id attribute
    const idMatch = attributes.match(/id=["']([^"']+)["']/i);
    const id = idMatch ? idMatch[1] : `heading-toc-${index}`;

    if (text) {
      items.push({ id, level, text, tag });
    }
  }

  return items;
}

/**
 * Parse recipient CSV data safely for Mail Merge
 */
export function parseMailMergeCsv(csvText: string): MailMergeContact[] {
  const lines = csvText.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length < 2) return [];

  // Parse header
  const headers = parseCsvRow(lines[0]);
  const contacts: MailMergeContact[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvRow(lines[i]);
    if (values.length === 0) continue;
    const contact: MailMergeContact = {};
    headers.forEach((header, idx) => {
      contact[header] = values[idx] || '';
    });
    contacts.push(contact);
  }

  return contacts;
}

/**
 * Helper to parse a single CSV row handling quotes
 */
export function parseCsvRow(rowText: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < rowText.length; i++) {
    const char = rowText[i];
    if (char === '"') {
      if (inQuotes && rowText[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Replace mail merge variables in template content
 * Supports {{FieldName}}, «FieldName», and [[FieldName]]
 */
export function replaceMailMergeTokens(template: string, data: MailMergeContact): string {
  let output = template;
  for (const [key, value] of Object.entries(data)) {
    const regexCurly = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'gi');
    const regexGuillemet = new RegExp(`«\\s*${key}\\s*»`, 'gi');
    const regexBracket = new RegExp(`\\[\\[\\s*${key}\\s*\\]\\]`, 'gi');
    output = output.replace(regexCurly, value)
      .replace(regexGuillemet, value)
      .replace(regexBracket, value);
  }
  return output;
}

/**
 * Get page pixel dimensions for canvas rendering
 */
export function getPageDimensions(size: PaperSize, orientation: PageOrientation): { width: number; height: number } {
  // Base dimensions in standard 96 DPI CSS pixels
  let width = 794;  // A4 standard
  let height = 1123;

  switch (size) {
    case 'Letter':
      width = 816;  // 8.5" x 11"
      height = 1056;
      break;
    case 'Legal':
      width = 816;  // 8.5" x 14"
      height = 1344;
      break;
    case 'A3':
      width = 1123;
      height = 1587;
      break;
    case 'A4':
    default:
      width = 794;  // 210mm x 297mm
      height = 1123;
      break;
  }

  if (orientation === 'landscape') {
    return { width: height, height: width };
  }

  return { width, height };
}
