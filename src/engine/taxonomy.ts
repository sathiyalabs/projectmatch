/**
 * Explicit Domain Taxonomy for ProjectMatch
 * Deterministic mapping between skills and capability domains.
 * Enforces explicit domain evidence to prevent language over-generalization (e.g. Python != Backend).
 */

export const EXPLICIT_DOMAIN_EVIDENCE: Record<string, string[]> = {
  // ML Domain Evidence
  'tensorflow': ['ML'],
  'pytorch': ['ML'],
  'nlp': ['ML'],
  'machine learning': ['ML'],
  'deep learning': ['ML'],
  'computer vision': ['ML'],
  'llm': ['ML'],
  'prompt engineering': ['ML'],

  // Frontend Domain Evidence
  'react': ['Frontend'],
  'vue': ['Frontend'],
  'angular': ['Frontend'],
  'html/css': ['Frontend'],
  'html': ['Frontend'],
  'css': ['Frontend'],
  'ui development': ['Frontend'],
  'frontend engineering': ['Frontend'],
  'tailwind': ['Frontend'],
  'next.js': ['Frontend'],

  // UX Domain Evidence
  'figma': ['UX'],
  'ux research': ['UX'],
  'prototyping': ['UX'],
  'wireframing': ['UX'],
  'ui design': ['UX'],
  'design systems': ['UX'],

  // Backend Domain Evidence
  'node.js': ['Backend'],
  'express': ['Backend'],
  'fastapi': ['Backend'],
  'django': ['Backend'],
  'spring boot': ['Backend'],
  'rest apis': ['Backend'],
  'api architecture': ['Backend'],
  'server-side development': ['Backend'],
  'backend engineering': ['Backend'],
  'go': ['Backend'],
  'golang': ['Backend'],
  'java': ['Backend'],
  'c++': ['Backend'],
  'graphql': ['Backend'],
  'sql': ['Backend', 'Data'],
  'postgresql': ['Backend', 'Data'],
  'mongodb': ['Backend', 'Data'],

  // Cloud & DevOps Domain Evidence
  'aws': ['Cloud'],
  'azure': ['Cloud'],
  'gcp': ['Cloud'],
  'docker': ['Cloud'],
  'kubernetes': ['Cloud'],
  'ci/cd': ['Cloud'],
  'cloud infrastructure': ['Cloud'],
  'devops': ['Cloud'],
  'terraform': ['Cloud'],

  // Data Domain Evidence
  'pandas': ['Data'],
  'data pipelines': ['Data'],
  'analytics': ['Data'],

  // Security Domain Evidence
  'api security': ['Security'],
  'security testing': ['Security'],
  'oauth': ['Security'],
  'penetration testing': ['Security'],
  'owasp': ['Security'],
  'threat modeling': ['Security'],
  'application security': ['Security'],
  'authentication': ['Security', 'Backend'],

  // Product & Strategy Domain Evidence
  'product research': ['Product'],
  'user research': ['Product', 'UX'],
  'product strategy': ['Product'],
  'requirements': ['Product'],
  'roadmapping': ['Product'],
  'agile': ['Product'],
  'scrum': ['Product'],
  'accessibility': ['Frontend', 'UX'],
};

/**
 * Normalizes skill or capability string for deterministic comparison
 */
export function normalizeKey(str: string): string {
  return (str || '').trim().toLowerCase();
}

/**
 * Returns mapped domains for a given skill name taking into account candidate's explicit domain tags.
 * Python alone never satisfies Backend unless the candidate explicitly possesses the Backend domain.
 */
export function getDomainsForSkill(skillName: string, candidateDomains?: string[]): string[] {
  const norm = normalizeKey(skillName);

  // Special handling for general-purpose languages:
  if (norm === 'python') {
    const matched: string[] = [];
    const normalizedCandidateDomains = (candidateDomains || []).map(normalizeKey);
    if (normalizedCandidateDomains.includes('ml')) {
      matched.push('ML');
    }
    if (normalizedCandidateDomains.includes('data')) {
      matched.push('Data');
    }
    if (normalizedCandidateDomains.includes('backend')) {
      matched.push('Backend');
    }
    // If no candidate domain provided or strictly ML, default to ML
    return matched.length > 0 ? matched : ['ML'];
  }

  if (norm === 'typescript' || norm === 'javascript') {
    const matched: string[] = [];
    const normalizedCandidateDomains = (candidateDomains || []).map(normalizeKey);
    if (normalizedCandidateDomains.includes('frontend')) {
      matched.push('Frontend');
    }
    if (normalizedCandidateDomains.includes('backend')) {
      matched.push('Backend');
    }
    return matched.length > 0 ? matched : ['Frontend'];
  }

  if (EXPLICIT_DOMAIN_EVIDENCE[norm]) {
    return EXPLICIT_DOMAIN_EVIDENCE[norm];
  }

  // Exact / partial lookup across evidence table
  for (const [key, domains] of Object.entries(EXPLICIT_DOMAIN_EVIDENCE)) {
    if (norm === key || norm.includes(key) || key.includes(norm)) {
      return domains;
    }
  }

  return [];
}

