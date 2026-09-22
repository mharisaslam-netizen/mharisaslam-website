
export type CampaignInput = {
  campaignId: string;
  topic: string;
  market: string;
  objective: string;
  mode: string;
};

export type EvidenceItem = {
  claim: string;
  source: string;
  url: string;
};

export type SpecialistOutput = {
  role: string;
  summary: string;
  recommendations: string[];
  risks: string[];
  evidence: EvidenceItem[];
  candidateTopics: Array<{
    topic: string;
    whyNow: string;
    fit: string;
    risk: string;
  }>;
};

export type AnalyticsSnapshot = {
  period: { startDate: string; endDate: string };
  searchConsole: unknown;
  ga4: unknown;
  notes: string[];
};

export type Decision = {
  topic: string;
  thesis: string;
  headlineDirection: string;
  whyNow: string[];
  primaryAudience: string;
  commercialObjective: string;
  differentiators: string[];
  evidenceToUse: EvidenceItem[];
  evidenceToAvoid: string[];
};

export type AuthorityArticle = {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  lead: string;
  category: string;
  readMinutes: number;
  datePublished: string;
  visual: string[];
  operatingLens: string;
  sections: Array<{
    heading: string;
    paragraphs: string[];
    bullets: string[];
  }>;
  takeaways: string[];
  faq: Array<{ question: string; answer: string }>;
  sources: Array<{ title: string; publisher: string; url: string }>;
};

export type ChannelPackage = {
  linkedinPost: string;
  xPost: string;
  xThread: string[];
  mediumTitle: string;
  mediumSubtitle: string;
  mediumBody: string;
  substackSubject: string;
  substackSubtitle: string;
  substackOpeningNote: string;
  substackBody: string;
  substackCTA: string;
  wordpressTitle: string;
  wordpressExcerpt: string;
  wordpressHtml: string;
};

export type VisualBrief = {
  conceptName: string;
  objective: string;
  format: string;
  composition: string;
  textOverlay: string;
  imagePrompt: string;
  altText: string;
};

export type VerificationResult = {
  safeToStage: boolean;
  blockingIssues: string[];
  cautions: string[];
  verifiedClaims: Array<{
    claim: string;
    status: string;
    sourceUrl: string;
  }>;
};

export type StageResult = {
  github: Record<string, unknown>;
  wordpress: Record<string, unknown>;
  linkedin: Record<string, unknown>;
  visual: Record<string, unknown>;
};
