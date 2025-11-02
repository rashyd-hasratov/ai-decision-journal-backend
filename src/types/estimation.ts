export type EstimatePromptPayload = {
  description: string;
  decision: string;
  decisionExplanation?: string;
};

export type EstimationPromptResult = {
  decisionCategory: string;
  potentialCognitiveBiases: string[];
  alternatives: string[];
};
