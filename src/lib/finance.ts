export interface FinanceCalculationParams {
  price: number;
  deposit: number;
  termMonths: number;
  apr: number;
}

export interface FinanceCalculationResult {
  monthlyPayment: number;
  totalPayable: number;
  totalInterest: number;
  loanAmount: number;
}

/**
 * Standard UK car finance amortization calculator.
 * Calculates monthly repayment using standard annuity formula:
 * M = P * [r(1 + r)^n] / [(1 + r)^n - 1]
 */
export const calculateFinance = ({
  price,
  deposit,
  termMonths,
  apr,
}: FinanceCalculationParams): FinanceCalculationResult => {
  const safePrice = Math.max(0, price || 0);
  const safeDeposit = Math.min(safePrice, Math.max(0, deposit || 0));
  const loanAmount = Math.max(0, safePrice - safeDeposit);

  if (loanAmount <= 0 || termMonths <= 0) {
    return {
      monthlyPayment: 0,
      totalPayable: safePrice,
      totalInterest: 0,
      loanAmount: 0,
    };
  }

  const monthlyRate = apr / 100 / 12;
  let monthlyPayment = 0;

  if (monthlyRate === 0) {
    monthlyPayment = loanAmount / termMonths;
  } else {
    monthlyPayment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
      (Math.pow(1 + monthlyRate, termMonths) - 1);
  }

  const totalRepayments = monthlyPayment * termMonths;
  const totalPayable = totalRepayments + safeDeposit;
  const totalInterest = Math.max(0, totalPayable - safePrice);

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayable: Math.round(totalPayable * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    loanAmount: Math.round(loanAmount * 100) / 100,
  };
};
