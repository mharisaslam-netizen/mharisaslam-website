
export const specialistSchema = {
  type: "object",
  properties: {
    role: { type: "string" },
    summary: { type: "string" },
    recommendations: { type: "array", items: { type: "string" } },
    risks: { type: "array", items: { type: "string" } },
    evidence: {
      type: "array",
      items: {
        type: "object",
        properties: {
          claim: { type: "string" },
          source: { type: "string" },
          url: { type: "string" }
        },
        required: ["claim", "source", "url"],
        additionalProperties: false
      }
    },
    candidateTopics: {
      type: "array",
      items: {
        type: "object",
        properties: {
          topic: { type: "string" },
          whyNow: { type: "string" },
          fit: { type: "string" },
          risk: { type: "string" }
        },
        required: ["topic", "whyNow", "fit", "risk"],
        additionalProperties: false
      }
    }
  },
  required: ["role", "summary", "recommendations", "risks", "evidence", "candidateTopics"],
  additionalProperties: false
} as const;

export const decisionSchema = {
  type: "object",
  properties: {
    topic: { type: "string" },
    thesis: { type: "string" },
    headlineDirection: { type: "string" },
    whyNow: { type: "array", items: { type: "string" } },
    primaryAudience: { type: "string" },
    commercialObjective: { type: "string" },
    differentiators: { type: "array", items: { type: "string" } },
    evidenceToUse: {
      type: "array",
      items: {
        type: "object",
        properties: {
          claim: { type: "string" },
          source: { type: "string" },
          url: { type: "string" }
        },
        required: ["claim", "source", "url"],
        additionalProperties: false
      }
    },
    evidenceToAvoid: { type: "array", items: { type: "string" } }
  },
  required: [
    "topic","thesis","headlineDirection","whyNow","primaryAudience",
    "commercialObjective","differentiators","evidenceToUse","evidenceToAvoid"
  ],
  additionalProperties: false
} as const;

export const articleSchema = {
  type: "object",
  properties: {
    slug: { type: "string" },
    title: { type: "string" },
    seoTitle: { type: "string" },
    metaDescription: { type: "string" },
    lead: { type: "string" },
    category: { type: "string" },
    readMinutes: { type: "integer" },
    datePublished: { type: "string" },
    visual: { type: "array", items: { type: "string" } },
    operatingLens: { type: "string" },
    sections: {
      type: "array",
      items: {
        type: "object",
        properties: {
          heading: { type: "string" },
          paragraphs: { type: "array", items: { type: "string" } },
          bullets: { type: "array", items: { type: "string" } }
        },
        required: ["heading", "paragraphs", "bullets"],
        additionalProperties: false
      }
    },
    takeaways: { type: "array", items: { type: "string" } },
    faq: {
      type: "array",
      items: {
        type: "object",
        properties: {
          question: { type: "string" },
          answer: { type: "string" }
        },
        required: ["question", "answer"],
        additionalProperties: false
      }
    },
    sources: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          publisher: { type: "string" },
          url: { type: "string" }
        },
        required: ["title", "publisher", "url"],
        additionalProperties: false
      }
    }
  },
  required: [
    "slug","title","seoTitle","metaDescription","lead","category","readMinutes",
    "datePublished","visual","operatingLens","sections","takeaways","faq","sources"
  ],
  additionalProperties: false
} as const;

export const channelsSchema = {
  type: "object",
  properties: {
    linkedinPost: { type: "string" },
    xPost: { type: "string" },
    xThread: { type: "array", items: { type: "string" } },
    mediumTitle: { type: "string" },
    mediumSubtitle: { type: "string" },
    mediumBody: { type: "string" },
    substackSubject: { type: "string" },
    substackSubtitle: { type: "string" },
    substackOpeningNote: { type: "string" },
    substackBody: { type: "string" },
    substackCTA: { type: "string" },
    wordpressTitle: { type: "string" },
    wordpressExcerpt: { type: "string" },
    wordpressHtml: { type: "string" }
  },
  required: [
    "linkedinPost","xPost","xThread","mediumTitle","mediumSubtitle","mediumBody",
    "substackSubject","substackSubtitle","substackOpeningNote","substackBody",
    "substackCTA","wordpressTitle","wordpressExcerpt","wordpressHtml"
  ],
  additionalProperties: false
} as const;

export const visualSchema = {
  type: "object",
  properties: {
    conceptName: { type: "string" },
    objective: { type: "string" },
    format: { type: "string" },
    composition: { type: "string" },
    textOverlay: { type: "string" },
    imagePrompt: { type: "string" },
    altText: { type: "string" }
  },
  required: ["conceptName","objective","format","composition","textOverlay","imagePrompt","altText"],
  additionalProperties: false
} as const;

export const verificationSchema = {
  type: "object",
  properties: {
    safeToStage: { type: "boolean" },
    blockingIssues: { type: "array", items: { type: "string" } },
    cautions: { type: "array", items: { type: "string" } },
    verifiedClaims: {
      type: "array",
      items: {
        type: "object",
        properties: {
          claim: { type: "string" },
          status: { type: "string" },
          sourceUrl: { type: "string" }
        },
        required: ["claim", "status", "sourceUrl"],
        additionalProperties: false
      }
    }
  },
  required: ["safeToStage","blockingIssues","cautions","verifiedClaims"],
  additionalProperties: false
} as const;
