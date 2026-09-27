import assert from 'node:assert';

console.log('🧪 Lancement des tests de recommandation tarifaire ANSD & Gemini...\n');

const res = await fetch('http://localhost:3000/api/ansd/pricing-suggest', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Plateforme FinTech Micro-épargne & Tontine Mobile',
    description: 'Application d’épargne communautaire digitale pour les groupements de femmes et commerçants',
    sectorId: 'TECH_DIGITAL',
    regionId: 'DK',
    isUemoaExportTarget: true,
    uemoaTargetCountry: 'CI'
  })
});

assert.strictEqual(res.status, 200, 'L’API doit répondre avec le statut HTTP 200');
const data = await res.json();

assert.strictEqual(data.success, true, 'Le champ success doit être true');
assert.ok(data.suggestion, 'Une suggestion doit être présente');
assert.ok(data.suggestion.suggestedUnitPriceFcfa > 0, 'Le prix suggéré doit être positif');
assert.ok(data.suggestion.suggestedUnitCostFcfa > 0, 'Le coût suggéré doit être positif');
assert.ok(data.suggestion.suggestedMonthlyFixedCostsFcfa > 0, 'Les charges fixes doivent être positives');
assert.ok(data.suggestion.suggestedMonthlySalesVolume > 0, 'Le volume mensuel doit être positif');
assert.ok(data.suggestion.rationale.length > 20, 'Une justification détaillée doit être fournie');
assert.ok(data.suggestion.ansdBenchmarks.sectorMarginPct > 0, 'La marge de référence sectorielle doit être présente');

console.log('✓ TEST Réussi : Recommandation tarifaire ANSD & IA générée avec succès');
console.log(`  - Prix unitaire suggéré : ${data.suggestion.suggestedUnitPriceFcfa} FCFA`);
console.log(`  - Coût unitaire estimé  : ${data.suggestion.suggestedUnitCostFcfa} FCFA (Marge: ${data.suggestion.grossMarginPct}%)`);
console.log(`  - Charges fixes/mois    : ${data.suggestion.suggestedMonthlyFixedCostsFcfa} FCFA`);
console.log(`  - Volume cible mensuel  : ${data.suggestion.suggestedMonthlySalesVolume} unités`);
console.log(`  - Moteur actif          : ${data.suggestion.source}`);
console.log(`  - Justification         : "${data.suggestion.rationale.slice(0, 120)}..."\n`);
console.log('🎉 TOUS LES TESTS DU MOTEUR TARIFAIRE ANSD SONT VALIDÉS !');
