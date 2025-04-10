export interface GuardConfig {
  pii?: boolean;
  jailbreak?: boolean;
  profanity?: boolean;
  promptInjection?: boolean;
  relevance?: boolean;
  toxicity?: boolean;
  customRules?: Record<string, any>;
  relevanceOptions?: {
    minLength?: number;
    maxLength?: number;
    minWords?: number;
    maxWords?: number;
  };
}

export interface GuardResult {
  valid: boolean;
  score?: number;
  details?: {
    rule: string;
    message: string;
    matched?: string;
  }[];
}

export interface GuardResponse {
  id: string;
  input: string;
  isValid: boolean;
  score: number;
  results: GuardResult[];
}

export interface BatchGuardResponse {
  responses: GuardResponse[];
} 