import {
  StudentSubmission,
  ComparisonSource,
  SimilarityReport,
  MatchingPassage,
} from '../types';

export const MANDATORY_LIMITATIONS_NOTICE =
  'Similarity does not prove plagiarism. Common instructions, quotations, templates, and authorized collaboration may create legitimate overlap. A teacher must review the evidence and assignment rules before reaching a conclusion.';

/**
 * Normalizes regular text by removing punctuation, lowercasing, and normalizing whitespace.
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Tokenizes text into word tokens.
 */
export function tokenizeWords(text: string): string[] {
  const norm = normalizeText(text);
  return norm ? norm.split(' ').filter(Boolean) : [];
}

/**
 * Generates n-gram word shingles (default n=5).
 */
export function generateWordShingles(words: string[], n = 5): Set<string> {
  const shingles = new Set<string>();
  if (words.length < n) {
    if (words.length > 0) shingles.add(words.join(' '));
    return shingles;
  }
  for (let i = 0; i <= words.length - n; i++) {
    shingles.add(words.slice(i, i + n).join(' '));
  }
  return shingles;
}

/**
 * Normalizes source code: strips comments, normalizes strings, and collapses whitespace.
 */
export function normalizeCode(code: string): string {
  // Strip multi-line comments /* ... */
  let cleaned = code.replace(/\/\*[\s\S]*?\*\//g, ' ');
  // Strip single-line comments // ... or # ...
  cleaned = cleaned.replace(/(\/\/|#)[^\n]*/g, ' ');
  // Collapse whitespace
  return cleaned.replace(/\s+/g, ' ').trim();
}

/**
 * Extracts overlapping passages between a target submission and comparison sources.
 */
export function findMatchingPassages(
  targetText: string,
  sources: ComparisonSource[],
  minWords = 6
): MatchingPassage[] {
  const passages: MatchingPassage[] = [];
  const targetSentences = targetText
    .split(/(?<=[.!?\n])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  const seenMatches = new Set<string>();

  for (const sentence of targetSentences) {
    const normSentence = normalizeText(sentence);
    const sentenceWords = normSentence.split(' ').filter(Boolean);
    if (sentenceWords.length < minWords) continue;

    for (const source of sources) {
      const normSource = normalizeText(source.rawText);

      // Check if exact sentence or significant chunk is in source
      if (normSource.includes(normSentence)) {
        if (!seenMatches.has(normSentence)) {
          seenMatches.add(normSentence);
          const isBoilerplate =
            source.sourceType === 'Course Material' ||
            source.title.toLowerCase().includes('instruction') ||
            source.title.toLowerCase().includes('rubric') ||
            source.title.toLowerCase().includes('syllabus');

          passages.push({
            id: `match-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            matchedText: sentence,
            normalizedMatch: normSentence,
            sourceDocumentId: source.id,
            sourceDocumentTitle: source.title,
            sourceType: source.sourceType,
            sourceExcerpt: getExcerptAroundMatch(source.rawText, sentence),
            isBoilerplate,
          });
        }
        break; // Match found in this source
      } else {
        // Check for 6-word shingle overlap within sentence
        for (let i = 0; i <= sentenceWords.length - minWords; i += 3) {
          const subPhrase = sentenceWords.slice(i, i + minWords).join(' ');
          if (subPhrase.length > 25 && normSource.includes(subPhrase)) {
            if (!seenMatches.has(subPhrase)) {
              seenMatches.add(subPhrase);
              const isBoilerplate =
                source.sourceType === 'Course Material' ||
                source.title.toLowerCase().includes('instruction');

              passages.push({
                id: `match-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                matchedText: sentence,
                normalizedMatch: subPhrase,
                sourceDocumentId: source.id,
                sourceDocumentTitle: source.title,
                sourceType: source.sourceType,
                sourceExcerpt: getExcerptAroundMatch(source.rawText, subPhrase),
                isBoilerplate,
              });
            }
            break;
          }
        }
      }
    }
  }

  return passages;
}

/**
 * Returns a short context window around a match inside the source text.
 */
function getExcerptAroundMatch(sourceText: string, matchedText: string, windowChars = 120): string {
  const lowerSource = sourceText.toLowerCase();
  const lowerMatch = matchedText.toLowerCase().slice(0, 40);
  const idx = lowerSource.indexOf(lowerMatch);

  if (idx === -1) {
    return sourceText.slice(0, 180) + '...';
  }

  const start = Math.max(0, idx - windowChars / 2);
  const end = Math.min(sourceText.length, idx + matchedText.length + windowChars / 2);
  const prefix = start > 0 ? '...' : '';
  const suffix = end < sourceText.length ? '...' : '';
  return prefix + sourceText.slice(start, end).trim() + suffix;
}

/**
 * Calculates deterministic overlap between target and comparison sources.
 */
export function calculateSimilarity(
  submission: StudentSubmission,
  comparisonSources: ComparisonSource[],
  mode: 'text' | 'code' = 'text'
): SimilarityReport {
  const targetContent = mode === 'code' && submission.codeSnippet
    ? submission.codeSnippet
    : submission.textContent;

  const targetWords = mode === 'code'
    ? normalizeCode(targetContent).split(' ').filter(Boolean)
    : tokenizeWords(targetContent);

  if (targetWords.length === 0) {
    return {
      id: `report-${Date.now()}`,
      submissionId: submission.id,
      studentName: submission.studentName,
      assignmentTitle: submission.assignmentTitle,
      calculatedAt: new Date().toISOString(),
      detectionMode: mode,
      overallOverlapPercent: 0,
      matchingPassages: [],
      sourceBreakdown: [],
      commonBoilerplateMatches: [],
      limitationsNotice: MANDATORY_LIMITATIONS_NOTICE,
      teacherReviewStatus: 'Not reviewed',
    };
  }

  const targetShingles = generateWordShingles(targetWords, mode === 'code' ? 4 : 5);
  const matchingPassages = findMatchingPassages(targetContent, comparisonSources, mode === 'code' ? 5 : 6);

  // Calculate source-by-source overlap and identify overlapping shingles
  const overlappingShingles = new Set<string>();
  const sourceBreakdown: SimilarityReport['sourceBreakdown'] = [];
  const boilerplateMatches: string[] = [];

  for (const source of comparisonSources) {
    const sourceContent = mode === 'code' && source.rawCode ? source.rawCode : source.rawText;
    const sourceWords = mode === 'code'
      ? normalizeCode(sourceContent).split(' ').filter(Boolean)
      : tokenizeWords(sourceContent);

    const sourceShingles = generateWordShingles(sourceWords, mode === 'code' ? 4 : 5);

    let sharedCount = 0;
    for (const shingle of targetShingles) {
      if (sourceShingles.has(shingle)) {
        overlappingShingles.add(shingle);
        sharedCount++;
      }
    }

    const sourcePassages = matchingPassages.filter((p) => p.sourceDocumentId === source.id);
    const sourceOverlap = targetShingles.size > 0
      ? Math.min(100, Math.round((sharedCount / targetShingles.size) * 100))
      : 0;

    if (sourceOverlap > 0 || sourcePassages.length > 0) {
      sourceBreakdown.push({
        sourceId: source.id,
        sourceTitle: source.title,
        sourceType: source.sourceType,
        overlapPercent: sourceOverlap,
        passageCount: sourcePassages.length,
      });

      if (source.sourceType === 'Course Material' || source.title.toLowerCase().includes('instruction')) {
        sourcePassages.forEach((p) => {
          if (!boilerplateMatches.includes(p.matchedText)) {
            boilerplateMatches.push(p.matchedText);
          }
        });
      }
    }
  }

  // Calculate overall text overlap percentage
  const totalShingles = targetShingles.size;
  const overallOverlapPercent = totalShingles > 0
    ? Math.min(100, Math.round((overlappingShingles.size / totalShingles) * 100))
    : 0;

  // Initial deterministic explanation
  const aiExplanation = generateGroundedExplanation(
    submission,
    overallOverlapPercent,
    sourceBreakdown,
    boilerplateMatches,
    matchingPassages,
    mode
  );

  return {
    id: `report-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    submissionId: submission.id,
    studentName: submission.studentName,
    assignmentTitle: submission.assignmentTitle,
    calculatedAt: new Date().toISOString(),
    detectionMode: mode,
    overallOverlapPercent,
    matchingPassages,
    sourceBreakdown: sourceBreakdown.sort((a, b) => b.overlapPercent - a.overlapPercent),
    commonBoilerplateMatches: boilerplateMatches.slice(0, 3),
    aiExplanation,
    limitationsNotice: MANDATORY_LIMITATIONS_NOTICE,
    teacherReviewStatus: 'Not reviewed',
  };
}

/**
 * Generates an objective, transparent explanation grounded entirely in detected shingles and sources.
 * Emphasizes that this explains textual similarity and does not judge academic integrity.
 */
export function generateGroundedExplanation(
  submission: StudentSubmission,
  overlapPercent: number,
  sourceBreakdown: SimilarityReport['sourceBreakdown'],
  boilerplateMatches: string[],
  matchingPassages: MatchingPassage[],
  mode: 'text' | 'code'
): string {
  if (overlapPercent === 0) {
    return `No significant overlapping word sequences (5-grams) were detected between ${submission.studentName}'s submission and the ${sourceBreakdown.length} comparison documents. The written content demonstrates independent phrasing across all reviewed sections.`;
  }

  const primarySource = sourceBreakdown[0];
  const hasBoilerplate = boilerplateMatches.length > 0;
  const nonBoilerplateCount = matchingPassages.filter((p) => !p.isBoilerplate).length;

  let summary = `AI-Assisted Analysis Summary (${mode === 'code' ? 'Code Syntax Mode' : 'Text Shingle Mode'}):\n\n`;

  summary += `• Detected Overlap: ${overlapPercent}% of word sequences match authorized reference documents.\n`;

  if (primarySource) {
    summary += `• Primary Match: ${primarySource.sourceTitle} (${primarySource.sourceType}) accounts for ${primarySource.overlapPercent}% of matching shingles.\n`;
  }

  if (hasBoilerplate && nonBoilerplateCount === 0) {
    summary += `• Contextual Finding: Overlapping passages match standard assignment specifications and rubric requirements provided in the course instructions. This constitutes normal instructional boilerplate rather than copied solution logic.\n`;
  } else if (hasBoilerplate && nonBoilerplateCount > 0) {
    summary += `• Contextual Finding: Overlap consists of both shared course prompt terminology (${boilerplateMatches.length} template phrase(s)) and ${nonBoilerplateCount} specific implementation passage(s) that warrant brief human instructor check.\n`;
  } else {
    summary += `• Contextual Finding: The detected passages contain substantial phrase-level overlap with ${primarySource ? primarySource.sourceTitle : 'comparison source'}. Overlapping sections include algorithmic logic and architectural descriptions.\n`;
  }

  if (mode === 'code') {
    summary += `• Code Context Note: Code similarity scores reflect normalized tokens (ignoring whitespace and comments). High similarity may occur naturally with standard framework imports, API contracts, or boilerplate setup.\n`;
  }

  summary += `• Recommendation: Review the highlighted passages in the comparison viewer below. Talk with the student or request clarification before drawing any conclusions.`;

  return summary;
}
