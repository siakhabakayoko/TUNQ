import assert from 'node:assert';

// Unit economics & break-even validation test
function calculateBreakEven(unitPrice, unitCost, fixedCosts) {
  const unitMargin = unitPrice - unitCost;
  if (unitMargin <= 0) return { units: Infinity, revenue: Infinity };
  const units = Math.ceil(fixedCosts / unitMargin);
  const revenue = units * unitPrice;
  return { units, revenue, marginPct: (unitMargin / unitPrice) * 100 };
}

console.log('Running Financial Profitability Unit Tests...');

// Test 1: Standard profitable case
const res1 = calculateBreakEven(45000, 18000, 1850000);
assert.strictEqual(res1.units, 69, 'Break-even units should be 69');
assert.strictEqual(res1.revenue, 3105000, 'Break-even revenue should be 3,105,000 FCFA');
assert.strictEqual(res1.marginPct, 60, 'Gross margin should be 60%');
console.log('✓ Test 1 Passed: Standard break-even calculation');

// Test 2: Inflation shock (+15% cost)
const res2 = calculateBreakEven(45000, 18000 * 1.15, 1850000);
assert.ok(res2.marginPct > 50, 'Shock margin should remain above 50%');
console.log('✓ Test 2 Passed: 15% inflation stress test preserves viability');

// Test 3: Unviable pricing (cost > price)
const res3 = calculateBreakEven(1000, 1500, 500000);
assert.strictEqual(res3.units, Infinity, 'Deficit unit margin should yield infinite break-even');
console.log('✓ Test 3 Passed: Zero or negative margin correctly flagged');

console.log('\nAll Financial Engine Unit Tests PASSED!');
