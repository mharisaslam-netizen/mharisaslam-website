export function calculateContribution(input) {
  const keys = ["aov", "takeRate", "deliveryRevenue", "fulfilment", "packaging", "payments", "care", "claims", "incentives", "monthlyOrders", "fixedCost"];
  for (const key of keys) {
    if (typeof input[key] !== "number" || !Number.isFinite(input[key]) || input[key] < 0) throw new Error("Enter a non-negative number in every input.");
  }
  if (input.takeRate > 100) throw new Error("Commission must be between 0% and 100%.");
  if (!Number.isInteger(input.monthlyOrders)) throw new Error("Completed monthly orders must be a whole number.");
  const commission = input.aov * input.takeRate / 100;
  const revenue = commission + input.deliveryRevenue;
  const variableCost = input.fulfilment + input.packaging + input.payments + input.care + input.claims + input.incentives;
  const contribution = revenue - variableCost;
  const monthlyContribution = contribution * input.monthlyOrders;
  const monthlyResult = monthlyContribution - input.fixedCost;
  const breakEvenOrders = contribution > 0 ? Math.ceil(input.fixedCost / contribution) : null;
  if (![commission, revenue, variableCost, contribution, monthlyContribution, monthlyResult].every(Number.isFinite) || (breakEvenOrders !== null && !Number.isSafeInteger(breakEvenOrders))) throw new Error("The entered values exceed the supported calculation range.");
  return { commission, revenue, variableCost, contribution, monthlyContribution, monthlyResult, breakEvenOrders };
}

if (typeof document !== "undefined") {
  const root = document.querySelector("[data-contribution-model]");
  if (root) {
    const fields = [...root.querySelectorAll("input[name]")];
    const error = root.querySelector("[data-model-error]");
    const download = root.querySelector("[data-model-download]");
    const formatter = new Intl.NumberFormat("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const read = () => Object.fromEntries(fields.map(field => [field.name, field.value.trim() === "" ? NaN : Number(field.value)]));
    const update = () => {
      try {
        const result = calculateContribution(read());
        for (const output of root.querySelectorAll("[data-model-output]")) {
          const key = output.dataset.modelOutput;
          output.textContent = key === "breakEvenOrders" ? result[key] === null ? "No finite break-even at this contribution" : result[key].toLocaleString("en") : formatter.format(result[key]);
        }
        error.hidden = true;
        download.disabled = false;
        return result;
      } catch (cause) {
        error.textContent = cause.message;
        error.hidden = false;
        download.disabled = true;
        for (const output of root.querySelectorAll("[data-model-output]")) output.textContent = "Unavailable";
        return null;
      }
    };
    root.addEventListener("input", update);
    download.addEventListener("click", () => {
      const result = update();
      if (!result) return;
      const rows = [["Marketplace contribution scenario", "Illustrative inputs; one common currency"], ["Input / output", "Value"], ...fields.map(field => [field.parentElement.firstChild.textContent.trim(), read()[field.name]]), ...Object.entries(result).map(([key, value]) => [key, value === null ? "No finite break-even" : value]), ["Scope", "Third-party agency model; excludes tax differences, financing, capex and cash timing"]];
      const csv = rows.map(row => row.map(value => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\r\n");
      const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = "marketplace-contribution-scenario.csv";
      link.click();
      if (typeof window.gtag === "function") window.gtag("event", "tool_scenario_download", {
        tool_name: "marketplace_contribution",
        page_path: window.location.pathname
      });
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
    update();
  }
}
