export function calculateAge(dobString: string): number {
  const dob = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

export function calculatePremium(basePremium: number, isSmoker: boolean, category: string): number {
  let multiplier = 1.0;
  if (isSmoker && category === "term") {
    multiplier += 0.25; // 25% smoker loading for term plans
  }
  return Math.round(basePremium * multiplier);
}
