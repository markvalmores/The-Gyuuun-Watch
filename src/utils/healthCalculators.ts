import { ActivityMetrics, UserBiometrics, HealthStatusEvaluation } from '../types/watch';

// Default biometrics
export const defaultBiometrics: UserBiometrics = {
  gender: 'female',
  age: 26,
  heightCm: 165,
  weightKg: 58,
  restingHrBaseline: 62,
  fitnessLevel: 'active',
  pedometerSensitivity: 'medium',
};

// Calculate accurate stride length based on height and gender
export function calculateStrideLength(heightCm: number, gender: string): number {
  if (gender === 'male') {
    return Math.round(heightCm * 0.415);
  }
  return Math.round(heightCm * 0.413);
}

// Calculate MET (Metabolic Equivalent of Task) Calories
export function calculateMetCalories(
  steps: number,
  weightKg: number,
  heightCm: number,
  gender: string
): { calories: number; distanceKm: number } {
  const strideCm = calculateStrideLength(heightCm, gender);
  const totalMeters = (steps * strideCm) / 100;
  const distanceKm = Number((totalMeters / 1000).toFixed(2));

  // MET for average walking pace (3.5 km/h to 5 km/h) = ~3.8 METs
  // Energy (kcal) = MET * Weight(kg) * Duration(hours)
  // Avg pace = 110 steps/min -> duration in hours = (steps / 110) / 60
  const durationHours = (steps / 110) / 60;
  const metValue = 3.8;
  const calories = Math.round(metValue * weightKg * durationHours);

  return { calories: Math.max(0, calories), distanceKm };
}

// Calculate Body Mass Index (BMI)
export function calculateBmi(weightKg: number, heightCm: number): { bmi: number; category: string } {
  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

  let category = 'Normal Weight';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi >= 25 && bmi < 29.9) category = 'Overweight';
  else if (bmi >= 30) category = 'Obese';

  return { bmi, category };
}

// Comprehensive Scientific Health Status Evaluation
export function calculateHealthEvaluation(
  metrics: ActivityMetrics,
  biometrics: UserBiometrics
): HealthStatusEvaluation {
  const { bmi, category: bmiCategory } = calculateBmi(biometrics.weightKg, biometrics.heightCm);
  const strideLengthCm = calculateStrideLength(biometrics.heightCm, biometrics.gender);

  // 1. Step Progress Score (max 30 pts)
  const stepScore = Math.min(30, (metrics.steps / metrics.stepGoal) * 30);

  // 2. Cardiovascular Efficiency Score (max 25 pts)
  // Ideal Resting HR is between 50-70 BPM
  let hrScore = 25;
  const hrDiff = Math.abs(metrics.heartRateRest - biometrics.restingHrBaseline);
  if (hrDiff > 10) hrScore -= 5;
  if (hrDiff > 20) hrScore -= 10;

  // 3. Sleep & Recovery Score (max 25 pts)
  const sleepScore = (metrics.sleepScore / 100) * 25;

  // 4. Oxygen & Stress Index (max 20 pts)
  let vitalsScore = 20;
  if (metrics.spO2 < 95) vitalsScore -= 8;
  if (metrics.stressLevel > 50) vitalsScore -= 5;

  const overallScore = Math.min(100, Math.round(stepScore + hrScore + sleepScore + vitalsScore));

  let statusRating: HealthStatusEvaluation['statusRating'] = 'Optimal Biometrics';
  if (overallScore >= 90) statusRating = 'Optimal Biometrics';
  else if (overallScore >= 78) statusRating = 'Excellent Health';
  else if (overallScore >= 65) statusRating = 'Balanced Vitals';
  else if (overallScore >= 50) statusRating = 'Mild Fatigue';
  else statusRating = 'Recovery Recommended';

  // Cardiovascular Zone calculation (Max HR = 220 - Age)
  const maxHr = 220 - biometrics.age;
  const currentHrPercent = (metrics.heartRateCurrent / maxHr) * 100;

  let cardioZone: HealthStatusEvaluation['cardioZone'] = 'Warm-up / Recovery';
  if (currentHrPercent >= 85) cardioZone = 'Anaerobic Peak';
  else if (currentHrPercent >= 70) cardioZone = 'Aerobic Endurance';
  else if (currentHrPercent >= 55) cardioZone = 'Fat Burn Zone';

  // Estimated VO2 Max = 15 * (Max HR / Resting HR)
  const vo2MaxEstimate = Math.round(15 * (maxHr / metrics.heartRateRest));

  // Actionable recommendations
  const recommendations: string[] = [];
  if (metrics.steps < metrics.stepGoal) {
    recommendations.push(`Walk ${(metrics.stepGoal - metrics.steps).toLocaleString()} more steps to complete daily goal.`);
  }
  if (metrics.spO2 >= 98) {
    recommendations.push('SpO2 blood oxygen is in pristine range (98-100%).');
  }
  if (metrics.stressLevel < 30) {
    recommendations.push('Autonomic nervous system is relaxed. Great mental recovery!');
  }
  if (metrics.sleepHours < 7) {
    recommendations.push('Consider 30 mins earlier sleep tonight for optimal REM recovery.');
  }

  return {
    overallScore,
    statusRating,
    bmi,
    bmiCategory,
    strideLengthCm,
    metCalorieRate: 3.8,
    cardioZone,
    vo2MaxEstimate,
    recommendations,
  };
}
