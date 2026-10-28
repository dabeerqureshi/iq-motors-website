import { describe, it, expect } from "vitest";
import { calculateFinance } from "@/lib/finance";

describe("FinanceCalculator Logic", () => {
  it("calculates monthly payment correctly for standard 48-month agreement at 8.9% APR", () => {
    // £15,000 price, £1,500 deposit (10%), loan = £13,500, 48 months, 8.9% APR
    const result = calculateFinance({
      price: 15000,
      deposit: 1500,
      termMonths: 48,
      apr: 8.9,
    });

    expect(result.loanAmount).toBe(13500);
    // Standard amortization monthly payment should be approx £334 - £336
    expect(result.monthlyPayment).toBeGreaterThan(330);
    expect(result.monthlyPayment).toBeLessThan(340);
    expect(result.totalPayable).toBeGreaterThan(15000);
    expect(result.totalInterest).toBe(Math.round((result.totalPayable - 15000) * 100) / 100);
  });

  it("handles 100% deposit (zero loan balance)", () => {
    const result = calculateFinance({
      price: 20000,
      deposit: 20000,
      termMonths: 36,
      apr: 8.9,
    });

    expect(result.loanAmount).toBe(0);
    expect(result.monthlyPayment).toBe(0);
    expect(result.totalInterest).toBe(0);
    expect(result.totalPayable).toBe(20000);
  });

  it("handles 0% APR correctly without division by zero", () => {
    const result = calculateFinance({
      price: 12000,
      deposit: 2000,
      termMonths: 20,
      apr: 0,
    });

    expect(result.loanAmount).toBe(10000);
    expect(result.monthlyPayment).toBe(500);
    expect(result.totalInterest).toBe(0);
    expect(result.totalPayable).toBe(12000);
  });

  it("safely clamps excessive deposit so deposit does not exceed vehicle price", () => {
    const result = calculateFinance({
      price: 10000,
      deposit: 15000,
      termMonths: 36,
      apr: 8.9,
    });

    expect(result.loanAmount).toBe(0);
    expect(result.monthlyPayment).toBe(0);
  });
});
