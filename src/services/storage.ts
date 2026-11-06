/**
 * IndexedDB Document Storage for AuraWord
 * Provides offline-first, persistent document management and templates.
 */

import { DocumentRecord, PageSetup, ThemeSettings } from '../types/document';

const DB_NAME = 'auraword_db';
const DB_VERSION = 1;
const STORE_NAME = 'documents';

export const DEFAULT_PAGE_SETUP: PageSetup = {
  paperSize: 'Letter',
  orientation: 'portrait',
  margins: { top: 1, bottom: 1, left: 1, right: 1 },
  columns: 1,
  headerText: 'AuraWord Document',
  footerText: 'Confidential & Proprietary',
  showHeaderFooter: true,
  differentFirstPage: true,
  pageNumberFormat: 'pageOfTotal',
  pageNumberPosition: 'bottom-center',
};

export const DEFAULT_THEME: ThemeSettings = {
  themeName: 'Office',
  primaryColor: '#2b579a', // Classic Word blue
  fontFamily: 'Calibri, Aptos, sans-serif',
  headingFont: 'Calibri Light, Aptos Display, sans-serif',
  watermark: null,
  pageColor: '#ffffff',
  pageBorder: 'none',
  lineSpacing: 1.15,
};

export const TEMPLATES: { id: string; title: string; category: string; description: string; content: string }[] = [
  {
    id: 'blank',
    title: 'Blank Document',
    category: 'General',
    description: 'Start fresh with a clean, unformatted document.',
    content: `
      <h1 style="color: #2b579a;">Untitled Document</h1>
      <p>Start typing your document here. Use the ribbon controls above to format text, insert tables, add citations, and manage layout.</p>
    `,
  },
  {
    id: 'project-proposal',
    title: 'Project Proposal & Strategy',
    category: 'Business',
    description: 'Comprehensive business proposal with executive summary, timeline, and budget table.',
    content: `
      <h1 style="color: #2b579a;">Project Horizon: Next-Generation Enterprise Architecture</h1>
      <p style="font-size: 1.1em; color: #555;"><strong>Prepared for:</strong> Executive Steering Committee &bull; <strong>Date:</strong> October 2026</p>
      <hr />
      <h2>1. Executive Summary</h2>
      <p>Project Horizon represents an ambitious strategic initiative to modernize internal knowledge management, streamline document collaboration, and unify enterprise communications across distributed teams.</p>
      
      <h2>2. Strategic Objectives</h2>
      <ul>
        <li><strong>Reduced Latency:</strong> Accelerate document drafting workflows by 40%.</li>
        <li><strong>Data Sovereignty:</strong> Ensure 100% offline availability via local-first persistent storage.</li>
        <li><strong>Format Parity:</strong> Seamless interoperability with standard DOCX, PDF, and OpenXML standards.</li>
      </ul>

      <h2>3. Quarterly Implementation Budget</h2>
      <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <thead>
          <tr style="background-color: #f0f4f8;">
            <th style="border: 1px solid #cbd5e1; padding: 10px; text-align: left;">Phase & Milestone</th>
            <th style="border: 1px solid #cbd5e1; padding: 10px; text-align: left;">Duration</th>
            <th style="border: 1px solid #cbd5e1; padding: 10px; text-align: right;">Estimated Cost</th>
            <th style="border: 1px solid #cbd5e1; padding: 10px; text-align: center;">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Phase 1: Architecture & UI Engine</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">6 Weeks</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">$45,000</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; color: #16a34a; font-weight: bold;">Completed</td>
          </tr>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Phase 2: Mail Merge & Tracking</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">4 Weeks</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">$32,000</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; color: #2563eb; font-weight: bold;">In Progress</td>
          </tr>
          <tr>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">Phase 3: Rollout & Training</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px;">3 Weeks</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: right;">$18,000</td>
            <td style="border: 1px solid #cbd5e1; padding: 8px; text-align: center; color: #64748b;">Scheduled</td>
          </tr>
        </tbody>
      </table>

      <h2>4. Expected Outcomes & Milestones</h2>
      <p>Upon rollout, the organization will achieve full independence from legacy proprietary software locks while maintaining high fidelity document rendering.</p>
    `,
  },
  {
    id: 'academic-paper',
    title: 'Academic Research Paper',
    category: 'Academic',
    description: 'Formatted scholarly paper with abstract, citations, methodology, and bibliography.',
    content: `
      <h1 style="text-align: center; margin-bottom: 5px;">Cognitive Load Reduction in Web-Based Word Processing Systems</h1>
      <p style="text-align: center; color: #555; margin-bottom: 25px;"><em>Aura Research Institute &bull; Department of Human-Computer Interaction</em></p>
      
      <h3>Abstract</h3>
      <p><em>Modern knowledge workers spend an estimated 3.8 hours daily interacting with text editing interfaces. This study investigates the impact of ribbon-based discoverability, real-time citation linking, and local-first persistence on task completion rates and cognitive fatigue. Our findings demonstrate a 27% increase in sustained focus when utilizing contextual action toolbars.</em></p>
      
      <hr />

      <h2>1. Introduction</h2>
      <p>Word processing software has evolved significantly since the mechanical typewriter. However, many contemporary web editors sacrifice formatting depth in pursuit of minimalism, leaving academic and professional users underserved.</p>

      <h2>2. Methodology & Findings</h2>
      <p>We conducted empirical evaluations across 120 participants performing complex layout tasks including multi-level lists, mathematical formula insertions, and citation management.</p>
      
      <h2>3. References & Citations</h2>
      <p>Refer to Section 4 for complete APA citation sources managed through the References ribbon.</p>
    `,
  },
  {
    id: 'business-letter',
    title: 'Formal Business Letter',
    category: 'Letters',
    description: 'Standard executive correspondence template with professional header and signature blocks.',
    content: `
      <p style="margin-bottom: 20px;"><strong>AuraWord Global Solutions</strong><br />100 Innovation Way, Suite 400<br />San Francisco, CA 94105</p>
      
      <p style="margin-bottom: 20px;">October 21, 2026</p>

      <p style="margin-bottom: 20px;">
        <strong>Recipient:</strong> {{FirstName}} {{LastName}}<br />
        <strong>Organization:</strong> {{Company}}<br />
        <strong>Address:</strong> {{City}}
      </p>

      <p style="margin-bottom: 15px;">Dear {{FirstName}},</p>

      <p>Thank you for your inquiry regarding enterprise document licensing for <strong>{{Company}}</strong>. We are pleased to provide this comprehensive overview of AuraWord capabilities.</p>

      <p>AuraWord delivers desktop-class performance in a responsive web environment, featuring complete Microsoft Word compatibility, real DOCX import/export, mail merge workflows, and collaborative track changes.</p>

      <p>We look forward to partnering with your team. Please do not hesitate to contact us if you require additional demonstrations or custom deployment options.</p>

      <p style="margin-top: 30px;">Sincerely,</p>
      <p style="margin-top: 40px;"><strong>Arthur Pendelton</strong><br />Director of Enterprise Relations<br />AuraWord Technologies</p>
    `,
  },
];

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('updatedAt', 'updatedAt', { unique: false });
        store.createIndex('isPinned', 'isPinned', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Seed initial sample documents if the database is empty
 */
export async function initializeDatabase(): Promise<void> {
  const docs = await getAllDocuments();
  if (docs.length === 0) {
    const now = Date.now();
    for (const [idx, t] of TEMPLATES.entries()) {
      const record: DocumentRecord = {
        id: `doc-${t.id}-${now + idx}`,
        title: t.title,
        content: t.content,
        createdAt: now - (idx * 3600000),
        updatedAt: now - (idx * 1800000),
        author: 'AuraWord User',
        isPinned: idx === 0,
        pageSetup: { ...DEFAULT_PAGE_SETUP },
        theme: { ...DEFAULT_THEME },
        comments: idx === 1 ? [
          {
            id: 'c1',
            author: 'Sarah Jenkins',
            text: 'Please review the Phase 2 budget estimate before submission.',
            createdAt: now - 1200000,
            resolved: false,
            replies: [
              {
                id: 'r1',
                author: 'Alex Rivera',
                text: 'Updated figures will be confirmed by Friday.',
                createdAt: now - 600000,
              }
            ],
            selectionText: 'Estimated Cost: $32,000',
          }
        ] : [],
        trackChanges: idx === 1 ? [
          {
            id: 'tc1',
            type: 'insert',
            author: 'Sarah Jenkins',
            text: 'Streamline document collaboration',
            timestamp: now - 3600000,
            status: 'pending',
          }
        ] : [],
        trackingEnabled: false,
        citations: [
          {
            id: 'cite-1',
            key: '1',
            type: 'book',
            authors: 'Donald Norman',
            title: 'The Design of Everyday Things',
            year: '2013',
            publisher: 'Basic Books',
          },
          {
            id: 'cite-2',
            key: '2',
            type: 'journal',
            authors: 'Sarah Miller & David Clark',
            title: 'Latency and Precision in Modern Web Typography',
            year: '2025',
            journal: 'ACM Transactions on Computer Systems',
            volume: '42',
            pages: '112-128',
          }
        ],
        citationStyle: 'APA',
        drawingStrokes: [],
        recipients: [
          { FirstName: 'Jessica', LastName: 'Taylor', Company: 'Apex Global', City: 'Chicago' },
          { FirstName: 'Marcus', LastName: 'Chen', Company: 'Vanguard Systems', City: 'Seattle' },
          { FirstName: 'Sophia', LastName: 'Rodriguez', Company: 'Horizon Dynamics', City: 'Miami' },
        ],
      };
      await saveDocument(record);
    }
  }
}

export async function getAllDocuments(): Promise<DocumentRecord[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const results = (request.result as DocumentRecord[]) || [];
        // Sort: pinned first, then by updatedAt descending
        results.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return b.updatedAt - a.updatedAt;
        });
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.warn('Storage fallback to in-memory/localStorage:', err);
    return [];
  }
}

export async function getDocumentById(id: string): Promise<DocumentRecord | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function saveDocument(doc: DocumentRecord): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put({
      ...doc,
      updatedAt: Date.now(),
    });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function deleteDocument(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function duplicateDocument(id: string): Promise<DocumentRecord> {
  const original = await getDocumentById(id);
  if (!original) throw new Error('Document not found');

  const newDoc: DocumentRecord = {
    ...original,
    id: `doc-${Date.now()}`,
    title: `${original.title} (Copy)`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isPinned: false,
  };
  await saveDocument(newDoc);
  return newDoc;
}

export async function createNewDocument(templateId: string = 'blank', customTitle?: string): Promise<DocumentRecord> {
  const template = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0];
  const now = Date.now();
  const newDoc: DocumentRecord = {
    id: `doc-${now}`,
    title: customTitle || template.title,
    content: template.content,
    createdAt: now,
    updatedAt: now,
    author: 'AuraWord User',
    isPinned: false,
    pageSetup: { ...DEFAULT_PAGE_SETUP },
    theme: { ...DEFAULT_THEME },
    comments: [],
    trackChanges: [],
    trackingEnabled: false,
    citations: [],
    citationStyle: 'APA',
    drawingStrokes: [],
    recipients: [
      { FirstName: 'Jane', LastName: 'Doe', Company: 'Acme Corp', City: 'New York' },
      { FirstName: 'John', LastName: 'Smith', Company: 'Global Industries', City: 'Boston' },
    ],
  };

  await saveDocument(newDoc);
  return newDoc;
}

export async function togglePin(id: string): Promise<boolean> {
  const doc = await getDocumentById(id);
  if (!doc) return false;
  doc.isPinned = !doc.isPinned;
  await saveDocument(doc);
  return doc.isPinned;
}
