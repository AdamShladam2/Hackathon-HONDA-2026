import { School } from '../types';

export const KNOWN_SCHOOLS: Record<string, School> = {
  'osu.edu': {
    id: 'osu',
    name: 'The Ohio State University',
    domain: 'osu.edu',
    shortName: 'OSU',
    mascot: 'Buckeyes',
    colors: {
      primary: '#BA0C2F',
      secondary: '#666666',
      accent: '#990000',
    },
  },
  'umich.edu': {
    id: 'umich',
    name: 'University of Michigan',
    domain: 'umich.edu',
    shortName: 'UMich',
    mascot: 'Wolverines',
    colors: {
      primary: '#00274C',
      secondary: '#FFCB05',
      accent: '#0C2340',
    },
  },
  'stanford.edu': {
    id: 'stanford',
    name: 'Stanford University',
    domain: 'stanford.edu',
    shortName: 'Stanford',
    mascot: 'Cardinal',
    colors: {
      primary: '#8C1515',
      secondary: '#4D4F53',
      accent: '#B1040E',
    },
  },
  'berkeley.edu': {
    id: 'berkeley',
    name: 'UC Berkeley',
    domain: 'berkeley.edu',
    shortName: 'Cal',
    mascot: 'Golden Bears',
    colors: {
      primary: '#003262',
      secondary: '#FDB515',
      accent: '#002040',
    },
  },
};

export interface EmailValidationResult {
  isValid: boolean;
  errorMessage?: string;
  domain?: string;
  school?: School;
}

export function validateSchoolEmail(email: string): EmailValidationResult {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed) {
    return {
      isValid: false,
      errorMessage: 'Please enter your university email address.',
    };
  }

  const atIndex = trimmed.lastIndexOf('@');
  if (atIndex === -1 || atIndex === 0 || atIndex === trimmed.length - 1) {
    return {
      isValid: false,
      errorMessage: 'Please enter a valid email address with an "@" symbol.',
    };
  }

  const domain = trimmed.slice(atIndex + 1);

  if (!domain.endsWith('.edu')) {
    return {
      isValid: false,
      errorMessage: 'Access is restricted to accredited college emails ending in .edu (e.g. name@osu.edu).',
    };
  }

  // Check known school registry or dynamically create school representation for arbitrary .edu
  let school = KNOWN_SCHOOLS[domain];
  if (!school) {
    // Generate clean school descriptor for other valid .edu domains
    const prefix = domain.replace('.edu', '');
    const capitalized = prefix
      .split('.')
      .map((part) => part.toUpperCase())
      .join(' ');

    school = {
      id: prefix.replace(/[^a-z0-9]/g, '-'),
      name: `${capitalized} University`,
      domain,
      shortName: prefix.toUpperCase(),
      mascot: 'Scholars',
      colors: {
        primary: '#1E3A8A',
        secondary: '#64748B',
        accent: '#2563EB',
      },
    };
  }

  return {
    isValid: true,
    domain,
    school,
  };
}
