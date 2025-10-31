"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { generatePayoutHistoryPDF } from "@/lib/pdf-generator";
import { toast } from "sonner";
import { Pagination } from "@/components/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Header } from "@/components/header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const transactions = [
  {
    id: "TXN12345",
    description: "Grocery shopping at Local Market",
    date: "July 20, 2024",
    paymentMethod: "Bank Card",
    amount: -75.50,
    status: "Completed"
  },
  {
    id: "TXN67890",
    description: "Payment received from Emily",
    date: "July 19, 2024",
    paymentMethod: "Apple Pay",
    amount: 200.00,
    status: "Completed"
  },
  {
    id: "TXN11223",
    description: "Dinner at The Bistro",
    date: "July 18, 2024",
    paymentMethod: "Debit Card",
    amount: -45.00,
    status: "Completed"
  },
  {
    id: "TXN33445",
    description: "Online purchase from Tech Store",
    date: "July 17, 2024",
    paymentMethod: "UPI",
    amount: -120.00,
    status: "Completed"
  },
  {
    id: "TXN55667",
    description: "Salary deposit",
    date: "July 16, 2024",
    paymentMethod: "Bank Transfer",
    amount: 3000.00,
    status: "Completed"
  }
];

const recentWithdrawals = [
  { date: "12/11/2023", amount: 50.00 },
  { date: "12/11/2023", amount: 50.00 },
  { date: "12/11/2023", amount: 50.00 }
];

const vouchers = [
  {
    code: "1234567890",
    date: "2023-08-15",
    amount: 100,
    status: "Active"
  },
  {
    code: "9876543210",
    date: "2023-07-20",
    amount: 50,
    status: "Used"
  },
  {
    code: "4567890123",
    date: "2023-06-10",
    amount: 200,
    status: "Expired"
  }
];

const payoutHistory = [
  { date: "Sun Oct 26 2025", amount: 60, paymentMethod: "Stripe", status: "processed" },
  { date: "Sun Oct 26 2025", amount: 84, paymentMethod: "Stripe", status: "processed" },
  { date: "Sun Oct 26 2025", amount: 85, paymentMethod: "Stripe", status: "processed" },
  { date: "Sun Oct 26 2025", amount: 70, paymentMethod: "Stripe", status: "processed" },
  { date: "Sun Oct 26 2025", amount: 32, paymentMethod: "Stripe", status: "processed" },
  { date: "Sun Oct 26 2025", amount: 97, paymentMethod: "Stripe", status: "processed" },
  { date: "Sun Oct 26 2025", amount: 21, paymentMethod: "Stripe", status: "processed" },
  { date: "Sun Oct 26 2025", amount: 93, paymentMethod: "Stripe", status: "processed" },
  { date: "Sun Oct 26 2025", amount: 69, paymentMethod: "Stripe", status: "processed" },
  { date: "Sun Oct 26 2025", amount: 81, paymentMethod: "Stripe", status: "processed" },
  { date: "Sun Oct 26 2025", amount: 14, paymentMethod: "Stripe", status: "processed" },
  { date: "Sun Oct 26 2025", amount: 5, paymentMethod: "Stripe", status: "processed" },
  { date: "Sun Oct 26 2025", amount: 39, paymentMethod: "Stripe", status: "processed" },
  { date: "Sun Oct 26 2025", amount: 77, paymentMethod: "Stripe", status: "processed" }
];

export default function WalletPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [activeSection, setActiveSection] = useState<"transactions" | "vouchers" | "payout">("transactions");
  const [voucherAmount, setVoucherAmount] = useState("");

  const availableBalance = 1234.56;
  const itemsPerPage = 5;

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const transactionsTotalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const transactionsStartIndex = (currentPage - 1) * itemsPerPage;
  const transactionsEndIndex = transactionsStartIndex + itemsPerPage;
  const currentTransactions = filteredTransactions.slice(transactionsStartIndex, transactionsEndIndex);

  const vouchersTotalPages = Math.ceil(vouchers.length / itemsPerPage);
  const vouchersStartIndex = (currentPage - 1) * itemsPerPage;
  const vouchersEndIndex = vouchersStartIndex + itemsPerPage;
  const currentVouchers = vouchers.slice(vouchersStartIndex, vouchersEndIndex);

  const payoutTotalPages = Math.ceil(payoutHistory.length / itemsPerPage);
  const payoutStartIndex = (currentPage - 1) * itemsPerPage;
  const payoutEndIndex = payoutStartIndex + itemsPerPage;
  const currentPayouts = payoutHistory.slice(payoutStartIndex, payoutEndIndex);

  const handleQuickAmount = (amount: number) => {
    setWithdrawAmount(amount.toString());
  };

  const handleWithdraw = () => {
    console.log("Withdrawing:", withdrawAmount);
    setIsWithdrawOpen(false);
  };

  const handleDownloadPayoutPDF = () => {
    try {
      generatePayoutHistoryPDF(payoutHistory);
      toast.success("Payout history report downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download report. Please try again.");
      console.error("Failed to generate PDF:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <div className="flex-1">

          <div className="flex">
            {/* Left Sidebar - Wallet Menu */}
            <div className="w-80 bg-white border-r p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Wallet</h2>
                <button className="p-2 hover:bg-gray-100 rounded">
                  <span className="text-lg">📋</span>
                </button>
              </div>

              <nav className="space-y-1">
                <button
                  onClick={() => setActiveSection("transactions")}
                  className={`w-full flex items-center gap-3 px-6 py-3 rounded-lg text-left transition-colors ${
                    activeSection === "transactions" ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}
                >
                  <span className="text-lg">💸</span>
                  <span className={activeSection === "transactions" ? "font-medium text-gray-900" : "font-normal text-gray-900"}>Transactions</span>
                </button>
                <button
                  onClick={() => setActiveSection("vouchers")}
                  className={`w-full flex items-center gap-3 px-6 py-3 rounded-lg text-left transition-colors ${
                    activeSection === "vouchers" ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}
                >
                  <span className="text-lg">🎟️</span>
                  <span className={activeSection === "vouchers" ? "font-medium text-gray-900" : "font-normal text-gray-900"}>Vouchers</span>
                </button>
                <button
                  onClick={() => setActiveSection("payout")}
                  className={`w-full flex items-center gap-3 px-6 py-3 rounded-lg text-left transition-colors ${
                    activeSection === "payout" ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}
                >
                  <span className="text-lg">💰</span>
                  <span className={activeSection === "payout" ? "font-medium text-gray-900" : "font-normal text-gray-900"}>payout</span>
                </button>
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
              {activeSection === "transactions" && (
                <>
              <h1 className="text-2xl font-semibold mb-6">Transaction</h1>

              {/* Balance Cards */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-100 rounded-lg p-6">
                  <p className="text-gray-600 text-sm mb-2">Current Balance</p>
                  <p className="text-3xl font-bold">$400</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-6">
                  <p className="text-gray-600 text-sm mb-2">Available Earnings</p>
                  <p className="text-3xl font-bold">$600</p>
                </div>
              </div>

              <div className="flex justify-end mb-6">
                <Button
                  className="bg-black text-white hover:bg-gray-800 px-8 py-2 rounded-lg font-medium"
                  onClick={() => setIsWithdrawOpen(true)}
                >
                  Withdraw Now
                </Button>
              </div>

              {/* Transaction History */}
              <div className="bg-white rounded-lg border">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Search transactions"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-gray-50 border-gray-200"
                    />
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold text-gray-900">Transaction #</TableHead>
                      <TableHead className="font-semibold text-gray-900">Description</TableHead>
                      <TableHead className="font-semibold text-gray-900">Date</TableHead>
                      <TableHead className="font-semibold text-gray-900">Payment Method</TableHead>
                      <TableHead className="font-semibold text-gray-900">Amount</TableHead>
                      <TableHead className="font-semibold text-gray-900">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentTransactions.map((transaction) => (
                      <TableRow key={transaction.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-blue-600">
                          {transaction.id}
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell className="text-gray-600">{transaction.date}</TableCell>
                        <TableCell className="text-gray-600">{transaction.paymentMethod}</TableCell>
                        <TableCell className={transaction.amount > 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                          {transaction.amount > 0 ? "+" : ""}{transaction.amount < 0 ? "-" : ""}${Math.abs(transaction.amount).toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                            {transaction.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="p-6 border-t">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={transactionsTotalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
                </>
              )}

              {activeSection === "vouchers" && (
                <>
                  <h1 className="text-2xl font-semibold mb-6">Vouchers</h1>

                  {/* Available Amount Card and Convert Section */}
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    {/* Black Balance Card */}
                    <div className="bg-black text-white rounded-2xl p-8">
                      <p className="text-sm mb-2 opacity-90">Available Amount:</p>
                      <p className="text-4xl font-bold">${availableBalance.toFixed(2)}</p>
                    </div>

                    {/* Amount Input and Convert Button */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Amount</label>
                        <div className="relative">
                          <Input
                            type="number"
                            value={voucherAmount}
                            onChange={(e) => setVoucherAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="pr-8 h-12 text-lg border-gray-300"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">$</span>
                        </div>
                      </div>
                      <Button className="w-full h-12 bg-black text-white hover:bg-gray-800 text-base font-medium">
                        Convert Into Voucher
                      </Button>
                    </div>
                  </div>

                  {/* Voucher History */}
                  <div className="bg-white rounded-lg border">
                    <div className="p-6 border-b">
                      <h2 className="text-xl font-semibold">Voucher History</h2>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold text-gray-900">Voucher Code</TableHead>
                          <TableHead className="font-semibold text-gray-900">Date</TableHead>
                          <TableHead className="font-semibold text-gray-900">Amount</TableHead>
                          <TableHead className="font-semibold text-gray-900">Status</TableHead>
                          <TableHead className="font-semibold text-gray-900">View</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentVouchers.map((voucher, index) => (
                          <TableRow key={index} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{voucher.code}</TableCell>
                            <TableCell className="text-gray-600">{voucher.date}</TableCell>
                            <TableCell className="font-medium">{voucher.amount}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                voucher.status === "Active" ? "bg-green-50 text-green-700" :
                                voucher.status === "Used" ? "bg-gray-50 text-gray-700" :
                                "bg-red-50 text-red-700"
                              }`}>
                                {voucher.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              <button className="text-green-600 hover:text-green-700 font-medium">
                                View
                              </button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <div className="p-6 border-t">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={vouchersTotalPages}
                        onPageChange={setCurrentPage}
                      />
                    </div>
                  </div>
                </>
              )}

              {activeSection === "payout" && (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold">Payout History</h1>
                    <Button
                      onClick={handleDownloadPayoutPDF}
                      className="bg-black text-white hover:bg-gray-800"
                    >
                      <span className="mr-2">📄</span>
                      PDF
                    </Button>
                  </div>

                  <div className="bg-white rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold text-gray-900">Date</TableHead>
                          <TableHead className="font-semibold text-gray-900">Amount</TableHead>
                          <TableHead className="font-semibold text-gray-900">Payment Method</TableHead>
                          <TableHead className="font-semibold text-gray-900">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentPayouts.map((payout, index) => (
                          <TableRow key={index} className="hover:bg-gray-50">
                            <TableCell className="text-gray-900">{payout.date}</TableCell>
                            <TableCell className="font-medium">{payout.amount}</TableCell>
                            <TableCell className="text-gray-900">{payout.paymentMethod}</TableCell>
                            <TableCell>
                              <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                                {payout.status}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <div className="p-6 border-t">
                      <Pagination
                        currentPage={currentPage}
                        totalPages={payoutTotalPages}
                        onPageChange={setCurrentPage}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Withdraw Dialog */}
      <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
        <DialogContent className="max-w-3xl p-0">
          <div className="relative">
            <button
              onClick={() => setIsWithdrawOpen(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-10"
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </button>

            <div className="p-8">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl font-semibold">Withdraw</DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-8">
                {/* Left Column - Balance Card */}
                <div className="bg-black text-white rounded-2xl p-8">
                  <p className="text-sm mb-2 opacity-90">Available balance:</p>
                  <p className="text-4xl font-bold">${availableBalance.toFixed(2)}</p>
                </div>

                {/* Right Column - Amount Input */}
                <div className="space-y-4">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">$</span>
                    <Input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder=""
                      className="pl-8 h-12 text-lg border-gray-300"
                    />
                  </div>

                  {/* Quick Amount Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 bg-gray-100 border-0 hover:bg-gray-200"
                      onClick={() => handleQuickAmount(20)}
                    >
                      $20
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 bg-gray-100 border-0 hover:bg-gray-200"
                      onClick={() => handleQuickAmount(50)}
                    >
                      $50
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 bg-gray-100 border-0 hover:bg-gray-200"
                      onClick={() => handleQuickAmount(20)}
                    >
                      $20
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 bg-gray-100 border-0 hover:bg-gray-200"
                      onClick={() => handleQuickAmount(50)}
                    >
                      $50
                    </Button>
                  </div>

                  <Button
                    onClick={handleWithdraw}
                    className="w-full h-12 bg-black text-white hover:bg-gray-800 text-base font-medium"
                  >
                    Withdraw
                  </Button>
                </div>
              </div>

              {/* Transaction Details */}
              <div className="mt-8 space-y-4">
                <h3 className="font-semibold text-lg">Transaction details</h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Currency</span>
                    <span className="font-medium">USD</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">US Dollar Equivalent</span>
                    <span className="font-medium">1 USD = 1.14 EUR</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Exchange Rate</span>
                    <span className="font-medium">1.14 USD = 1 USD</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Fees</span>
                    <span className="font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Transfer to Account</span>
                    <span className="font-medium">$600</span>
                  </div>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="mt-8">
                <h3 className="font-semibold text-lg mb-4">Recent transactions</h3>

                <div className="space-y-3">
                  {recentWithdrawals.map((withdrawal, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Withdrawal</p>
                        <p className="text-sm text-gray-500">{withdrawal.date}</p>
                      </div>
                      <span className="text-red-600 font-semibold">- ${withdrawal.amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
