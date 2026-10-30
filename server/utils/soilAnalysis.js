// Rule-based soil health scoring. Thresholds are general guidance (kg/ha for NPK).
const rate = (value, low, high) => (value < low ? 'low' : value > high ? 'high' : 'optimal');

function analyzeSoil(reading) {
  if (!reading) return null;
  const { ph, nitrogen, phosphorus, potassium, moisture, organicCarbon } = reading;
  const findings = [];
  const recommendations = [];
  let score = 100;

  if (ph != null) {
    const r = rate(ph, 6.0, 7.5);
    findings.push({ parameter: 'pH', value: ph, rating: r });
    if (r === 'low') {
      score -= 20;
      recommendations.push('Soil is acidic: apply agricultural lime or dolomite to raise pH.');
    } else if (r === 'high') {
      score -= 20;
      recommendations.push('Soil is alkaline: apply gypsum or elemental sulphur and add organic matter.');
    }
  }
  if (nitrogen != null) {
    const r = rate(nitrogen, 280, 560);
    findings.push({ parameter: 'Nitrogen', value: nitrogen, rating: r });
    if (r === 'low') {
      score -= 15;
      recommendations.push('Low nitrogen: apply urea/compost or grow a legume in rotation.');
    } else if (r === 'high') score -= 5;
  }
  if (phosphorus != null) {
    const r = rate(phosphorus, 11, 25);
    findings.push({ parameter: 'Phosphorus', value: phosphorus, rating: r });
    if (r === 'low') {
      score -= 15;
      recommendations.push('Low phosphorus: apply DAP or single super phosphate at sowing.');
    } else if (r === 'high') score -= 5;
  }
  if (potassium != null) {
    const r = rate(potassium, 110, 280);
    findings.push({ parameter: 'Potassium', value: potassium, rating: r });
    if (r === 'low') {
      score -= 15;
      recommendations.push('Low potassium: apply muriate of potash (MOP).');
    } else if (r === 'high') score -= 5;
  }
  if (moisture != null) {
    const r = rate(moisture, 20, 60);
    findings.push({ parameter: 'Moisture', value: moisture, rating: r });
    if (r === 'low') {
      score -= 10;
      recommendations.push('Soil is dry: irrigate and consider mulching to retain moisture.');
    } else if (r === 'high') {
      score -= 10;
      recommendations.push('Soil is waterlogged: improve drainage and hold off irrigation.');
    }
  }
  if (organicCarbon != null) {
    const r = rate(organicCarbon, 0.5, 0.75);
    findings.push({ parameter: 'Organic carbon', value: organicCarbon, rating: r });
    if (r === 'low') {
      score -= 10;
      recommendations.push('Low organic carbon: add farmyard manure, compost or green manure.');
    }
  }

  score = Math.max(0, score);
  const grade = score >= 80 ? 'Good' : score >= 55 ? 'Moderate' : 'Poor';
  if (!recommendations.length) recommendations.push('Soil parameters look healthy. Maintain current practices.');
  return { score, grade, findings, recommendations };
}

module.exports = { analyzeSoil };
