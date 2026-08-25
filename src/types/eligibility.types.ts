export interface RuleCriteria {
  min_age?: number;
  max_age?: number;
  min_income?: number;
  allow_smoker?: boolean;
  disallowed_medical?: string[];
  allowed_vehicle_types?: string[];
}

export interface EligibilityEvaluationResult {
  productId: string;
  isEligible: boolean;
  disqualificationReasons: string[];
  calculatedPremium: number;
}
