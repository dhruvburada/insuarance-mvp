import { Client, InsuranceProduct } from "@/types/product.types";
import { EligibilityEvaluationResult, RuleCriteria } from "@/types/eligibility.types";
import { calculateAge, calculatePremium } from "./rules";

export function evaluateEligibility(
  client: Client,
  product: InsuranceProduct
): EligibilityEvaluationResult {
  const age = calculateAge(client.dob);
  const reasons: string[] = [];
  const rules = (product.eligibility_rules as RuleCriteria) || {};

  if (rules.min_age !== undefined && age < rules.min_age) {
    reasons.push(`Minimum age required is ${rules.min_age} years (client is ${age})`);
  }

  if (rules.max_age !== undefined && age > rules.max_age) {
    reasons.push(`Maximum age limit is ${rules.max_age} years (client is ${age})`);
  }

  if (rules.min_income !== undefined && Number(client.annual_income) < rules.min_income) {
    reasons.push(
      `Minimum annual income required is ₹${rules.min_income.toLocaleString("en-IN")}`
    );
  }

  if (rules.allow_smoker === false && client.is_smoker) {
    reasons.push("Policy does not cover active tobacco/nicotine users");
  }

  if (rules.disallowed_medical && rules.disallowed_medical.length > 0) {
    const preExisting = Object.entries(
      (client.medical_history as Record<string, boolean>) || {}
    )
      .filter(([_, value]) => Boolean(value))
      .map(([key]) => key);

    const conflicts = preExisting.filter((cond) =>
      rules.disallowed_medical!.includes(cond)
    );

    if (conflicts.length > 0) {
      reasons.push(
        `Pre-existing condition(s) not eligible for standard quote: ${conflicts.join(", ")}`
      );
    }
  }

  if (product.category === "vehicle" && rules.allowed_vehicle_types) {
    const vehicleDetails = (client.vehicle_details as Record<string, string>) || {};
    const vehicleType = vehicleDetails.type;
    if (!vehicleType || !rules.allowed_vehicle_types.includes(vehicleType)) {
      reasons.push(
        `Vehicle type '${vehicleType || "Unknown"}' is not eligible under this plan`
      );
    }
  }

  const isEligible = reasons.length === 0;
  const calculatedPremium = calculatePremium(
    Number(product.base_premium),
    client.is_smoker,
    product.category
  );

  return {
    productId: product.id,
    isEligible,
    disqualificationReasons: reasons,
    calculatedPremium,
  };
}
