import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { calculateFinance } from "@/lib/finance";

interface FinanceCalculatorProps {
  initialPrice?: number;
  vehicleTitle?: string;
  vehicleId?: string | number;
}

const FinanceCalculator = ({
  initialPrice = 15000,
  vehicleTitle,
  vehicleId,
}: FinanceCalculatorProps) => {
  const [vehiclePrice, setVehiclePrice] = useState<number>(initialPrice);
  const [deposit, setDeposit] = useState<number>(Math.round(initialPrice * 0.1));
  const [termMonths, setTermMonths] = useState<number>(48);
  const [apr, setApr] = useState<number>(8.9);

  const formatGBP = (val: number) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(val);

  const results = useMemo(() => {
    return calculateFinance({
      price: vehiclePrice,
      deposit,
      termMonths,
      apr,
    });
  }, [vehiclePrice, deposit, termMonths, apr]);

  const handleDepositPercent = (percent: number) => {
    setDeposit(Math.round(vehiclePrice * (percent / 100)));
  };

  const contactUrl = vehicleTitle
    ? `/contact?enquiry=finance&car=${encodeURIComponent(
        vehicleTitle
      )}&id=${encodeURIComponent(String(vehicleId || ""))}`
    : `/contact?enquiry=finance`;

  return (
    <Card className="border border-blue-100 shadow-md overflow-hidden bg-white">
      <CardHeader className="bg-gradient-to-r from-blue-900 to-stone-900 text-white p-6">
        <div className="flex items-center gap-2 mb-1">
          <Calculator className="w-5 h-5 text-blue-300" />
          <CardTitle className="text-xl md:text-2xl text-white">
            Finance Calculator
          </CardTitle>
        </div>
        <CardDescription className="text-blue-100 text-sm">
          {vehicleTitle
            ? `Estimate monthly repayments for ${vehicleTitle}`
            : "Estimate your monthly repayments and tailor terms to suit your budget"}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="vehicle-price" className="text-gray-700 font-semibold text-sm">
                Vehicle Price (£)
              </Label>
              <Input
                id="vehicle-price"
                type="number"
                min={1000}
                step={500}
                value={vehiclePrice || ""}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setVehiclePrice(val);
                  if (deposit > val) setDeposit(Math.round(val * 0.1));
                }}
                className="mt-1.5"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <Label htmlFor="deposit-amount" className="text-gray-700 font-semibold text-sm">
                  Cash Deposit (£)
                </Label>
                <div className="flex gap-1">
                  {[10, 20, 30].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleDepositPercent(pct)}
                      className="text-xs px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
              <Input
                id="deposit-amount"
                type="number"
                min={0}
                max={vehiclePrice}
                step={250}
                value={deposit || ""}
                onChange={(e) => setDeposit(Number(e.target.value))}
              />
            </div>

            <div>
              <Label className="text-gray-700 font-semibold text-sm block mb-1.5">
                Agreement Term
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {[24, 36, 48, 60].map((months) => (
                  <button
                    key={months}
                    type="button"
                    onClick={() => setTermMonths(months)}
                    className={`py-2 px-3 text-sm font-semibold rounded-md border text-center transition-all ${
                      termMonths === months
                        ? "bg-cardealer-primary text-white border-cardealer-primary shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {months} mo
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <Label htmlFor="apr-rate" className="text-gray-700 font-semibold text-sm">
                  Representative APR
                </Label>
                <span className="text-sm font-bold text-cardealer-primary">{apr}%</span>
              </div>
              <input
                id="apr-rate"
                type="range"
                min={5.9}
                max={15.9}
                step={0.1}
                value={apr}
                onChange={(e) => setApr(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Results Display */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-1">
                Estimated Monthly Payment
              </p>
              <div className="text-4xl font-extrabold text-cardealer-primary mb-4">
                {formatGBP(results.monthlyPayment)}
                <span className="text-sm font-normal text-gray-600 ml-1.5">/ month</span>
              </div>

              <div className="space-y-2.5 text-sm border-t border-blue-200/60 pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Borrowing Amount:</span>
                  <span className="font-semibold text-gray-900">{formatGBP(results.loanAmount)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Deposit Amount:</span>
                  <span className="font-semibold text-gray-900">{formatGBP(deposit)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Term Length:</span>
                  <span className="font-semibold text-gray-900">{termMonths} Months</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Total Interest:</span>
                  <span className="font-semibold text-gray-900">{formatGBP(results.totalInterest)}</span>
                </div>
                <div className="flex justify-between text-gray-900 font-bold pt-2 border-t border-blue-200/60">
                  <span>Total Amount Payable:</span>
                  <span>{formatGBP(results.totalPayable)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button
                asChild
                className="w-full bg-cardealer-primary hover:bg-cardealer-secondary text-white font-semibold py-5 gap-2 shadow-sm"
              >
                <Link to={contactUrl}>
                  Apply or Enquire for Finance
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* FCA Regulatory Notice */}
        <div className="bg-gray-50 border border-gray-200/80 rounded-lg p-3 text-xs text-gray-500 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <span className="font-semibold text-gray-700">FCA Representative Notice:</span> IQ Motors Limited is a credit broker, not a lender. We introduce you to a selected panel of lenders and brokers authorized and regulated by the Financial Conduct Authority (FCA). Finance is subject to status, terms and conditions. Applicants must be 18 or older. Figures shown are for illustration only.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinanceCalculator;

