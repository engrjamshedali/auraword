import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDocumentStats,
  convertTextCase,
  formatCitation,
  extractTableOfContents,
  parseMailMergeCsv,
  replaceMailMergeTokens,
  getPageDimensions,
} from './documentLogic';

test('calculateDocumentStats correctly counts words, chars, and paragraphs', () => {
  const sampleHtml = `
    <h1>AuraWord Project Report</h1>
    <p>This is a fast and responsive word processing application.</p>
    <p>It supports modern document formats, styling, and mail merge.</p>
  `;
  const stats = calculateDocumentStats(sampleHtml, 1);
  assert.equal(stats.paragraphs, 3);
  assert.ok(stats.words >= 15, `Expected at least 15 words, got ${stats.words}`);
  assert.ok(stats.characters > 50);
  assert.ok(stats.charactersNoSpaces > 40);
  assert.ok(stats.fleschScore > 0 && stats.fleschScore <= 100);
});

test('convertTextCase transforms strings correctly', () => {
  const input = 'hello world. this is auraword!';
  assert.equal(convertTextCase('hello world', 'uppercase'), 'HELLO WORLD');
  assert.equal(convertTextCase('HELLO WORLD', 'lowercase'), 'hello world');
  assert.equal(convertTextCase('hello world', 'title'), 'Hello World');
  assert.equal(convertTextCase('hello world', 'toggle'), 'HELLO WORLD');
});

test('formatCitation outputs expected formats for APA, MLA, IEEE, Chicago', () => {
  const source = {
    id: '1',
    key: '1',
    type: 'book' as const,
    authors: 'Ada Lovelace',
    title: 'Notes on the Analytical Engine',
    year: '1843',
    publisher: 'Taylor',
  };

  const apa = formatCitation(source, 'APA');
  assert.ok(apa.includes('Ada Lovelace (1843)'));
  assert.ok(apa.includes('Notes on the Analytical Engine'));

  const ieee = formatCitation(source, 'IEEE');
  assert.ok(ieee.startsWith('[1]'));
  assert.ok(ieee.includes('Ada Lovelace'));
});

test('extractTableOfContents parses H1, H2, H3 tags properly', () => {
  const html = `
    <h1 id="intro">Introduction</h1>
    <p>Some text</p>
    <h2 id="background">Background Research</h2>
    <h3>Phase 1 Details</h3>
    <p>More text</p>
  `;
  const toc = extractTableOfContents(html);
  assert.equal(toc.length, 3);
  assert.equal(toc[0].text, 'Introduction');
  assert.equal(toc[0].level, 1);
  assert.equal(toc[1].text, 'Background Research');
  assert.equal(toc[1].level, 2);
  assert.equal(toc[2].text, 'Phase 1 Details');
  assert.equal(toc[2].level, 3);
});

test('parseMailMergeCsv parses standard CSV and rows with quotes', () => {
  const csv = `FirstName,LastName,Company,City
Jane,Doe,"Acme, Inc.",Seattle
John,Smith,TechCorp,Austin`;

  const contacts = parseMailMergeCsv(csv);
  assert.equal(contacts.length, 2);
  assert.equal(contacts[0].FirstName, 'Jane');
  assert.equal(contacts[0].Company, 'Acme, Inc.');
  assert.equal(contacts[1].City, 'Austin');
});

test('replaceMailMergeTokens replaces curly and guillemet tokens', () => {
  const template = 'Dear {{FirstName}} {{LastName}}, welcome to «Company» in [[City]]!';
  const contact = {
    FirstName: 'Eleanor',
    LastName: 'Vance',
    Company: 'Aura Systems',
    City: 'Boston',
  };

  const result = replaceMailMergeTokens(template, contact);
  assert.equal(result, 'Dear Eleanor Vance, welcome to Aura Systems in Boston!');
});

test('getPageDimensions returns expected pixel sizes for Letter and A4 portrait/landscape', () => {
  const a4Portrait = getPageDimensions('A4', 'portrait');
  assert.equal(a4Portrait.width, 794);
  assert.equal(a4Portrait.height, 1123);

  const a4Landscape = getPageDimensions('A4', 'landscape');
  assert.equal(a4Landscape.width, 1123);
  assert.equal(a4Landscape.height, 794);

  const letterPortrait = getPageDimensions('Letter', 'portrait');
  assert.equal(letterPortrait.width, 816);
  assert.equal(letterPortrait.height, 1056);
});
