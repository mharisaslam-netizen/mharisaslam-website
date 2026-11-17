import assert from "node:assert/strict";
import { calculateContribution } from "../public/assets/order-contribution.js";

const inputs = { aov: 250, takeRate: 12, deliveryRevenue: 10, fulfilment: 12, packaging: 2, payments: 5, care: 2, claims: 3, incentives: 6, monthlyOrders: 1000, fixedCost: 20000 };
assert.deepEqual(calculateContribution(inputs), { commission: 30, revenue: 40, variableCost: 30, contribution: 10, monthlyContribution: 10000, monthlyResult: -10000, breakEvenOrders: 2000 });
assert.equal(calculateContribution({ ...inputs, incentives: 16 }).breakEvenOrders, null);
assert.equal(calculateContribution({ ...inputs, incentives: 26 }).monthlyResult, -30000);
assert.equal(calculateContribution({ ...inputs, monthlyOrders: 0 }).monthlyResult, -20000);
assert.equal(calculateContribution({ ...inputs, fixedCost: 0 }).breakEvenOrders, 0);
for (const invalid of [{ aov: NaN }, { takeRate: 101 }, { monthlyOrders: 1.5 }, { care: -1 }, { aov: 1e308, monthlyOrders: 1e308 }]) {
  assert.throws(() => calculateContribution({ ...inputs, ...invalid }));
}
console.log("Contribution calculator: default waterfall, downside, break-even and invalid-input checks passed.");
