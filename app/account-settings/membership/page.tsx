"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Check, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { CancelMembershipDialog } from "@/components/cancel-membership-dialog";
import { MembershipCancelledDialog } from "@/components/membership-cancelled-dialog";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: PlanFeature[];
  recommended?: boolean;
}

export default function MembershipPage() {
  const { toast } = useToast();
  const [currentPlan, setCurrentPlan] = useState({
    name: "Premium",
    expiryDate: "12/31/2024",
    isExpired: false,
  });
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showExpiredDialog, setShowExpiredDialog] = useState(false);

  useEffect(() => {
    const expiryDate = new Date(currentPlan.expiryDate);
    const today = new Date();
    const isExpired = today > expiryDate;

    if (isExpired) {
      setShowExpiredDialog(true);
      setCurrentPlan(prev => ({ ...prev, isExpired: true }));
    }
  }, [currentPlan.expiryDate]);

  const plans: Plan[] = [
    {
      id: "basic",
      name: "Basic",
      price: "Free",
      period: "/month",
      features: [
        { text: "Limited listings", included: true },
        { text: "Basic analytics", included: true },
        { text: "Unlimited listings", included: false },
        { text: "Advanced analytics", included: false },
        { text: "Priority support", included: false },
      ],
    },
    {
      id: "standard",
      name: "Standard",
      price: "$19.99",
      period: "/month",
      recommended: true,
      features: [
        { text: "Unlimited listings", included: true },
        { text: "Advanced analytics", included: true },
        { text: "Priority support", included: true },
        { text: "24/7 support", included: false },
        { text: "Exclusive features", included: false },
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: "$49.99",
      period: "/month",
      features: [
        { text: "Unlimited listings", included: true },
        { text: "Advanced analytics", included: true },
        { text: "24/7 support", included: true },
        { text: "Exclusive features", included: true },
      ],
    },
  ];

  const handleSelectPlan = (planId: string, planName: string) => {
    toast({
      title: "Plan Selected",
      description: `You have selected the ${planName} plan`,
    });
  };

  const handleCancelMembership = () => {
    setShowCancelDialog(true);
  };

  const handleUpgradeToPremium = () => {
    toast({
      title: "Upgrade Initiated",
      description: "Redirecting to payment page...",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        <div className="flex-1 p-12">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">Membership</h2>
            <Link href="/account-settings">
              <Button variant="ghost" className="text-gray-900 hover:bg-gray-100 gap-2">
                <ArrowLeft className="w-5 h-5" />
                Back to Account
              </Button>
            </Link>
          </div>

          <div className="max-w-6xl">
            {/* Current Plan Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Current Plan</h3>
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-6 h-6 text-gray-700" />
                      <div>
                        <p className="text-lg font-bold text-gray-900">{currentPlan.name}</p>
                        <p className="text-sm text-gray-600">
                          Expires on {currentPlan.expiryDate}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Available Plans Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Available Plans</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`relative ${
                      plan.recommended
                        ? "border-2 border-blue-500 shadow-lg"
                        : "border border-gray-200"
                    }`}
                  >
                    {plan.recommended && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-blue-500 text-white px-4 py-1 text-xs font-semibold">
                          Recommended
                        </Badge>
                      </div>
                    )}

                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-gray-900">
                        {plan.name}
                      </CardTitle>
                      <CardDescription className="mt-4">
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                          <span className="text-gray-600">{plan.period}</span>
                        </div>
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <Button
                        onClick={() => handleSelectPlan(plan.id, plan.name)}
                        variant="outline"
                        className="w-full mb-6 h-11 font-semibold border-gray-300 hover:bg-gray-100"
                      >
                        Select
                      </Button>

                      <ul className="space-y-3">
                        {plan.features.map((feature, index) => (
                          <li
                            key={index}
                            className={`flex items-start gap-2 ${
                              feature.included ? "text-gray-900" : "text-gray-400"
                            }`}
                          >
                            <Check
                              className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                                feature.included ? "text-green-600" : "text-gray-400"
                              }`}
                            />
                            <span className="text-sm">{feature.text}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-8 border-t border-gray-200">
              <Button
                onClick={handleCancelMembership}
                variant="ghost"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold"
              >
                Cancel Membership
              </Button>

              <Button
                onClick={handleUpgradeToPremium}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 text-base font-semibold rounded-lg"
              >
                Upgrade to Premium
              </Button>
            </div>

            {/* Info Box */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <CreditCard className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">
                    About Membership Plans
                  </h4>
                  <p className="text-sm text-gray-600">
                    Choose the plan that best fits your needs. You can upgrade or downgrade at any
                    time. All plans include a 30-day money-back guarantee.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CancelMembershipDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        membershipData={{
          planName: currentPlan.name,
          expirationDate: currentPlan.expiryDate,
        }}
      />

      <MembershipCancelledDialog
        open={showExpiredDialog}
        onOpenChange={setShowExpiredDialog}
        membershipData={{
          planName: currentPlan.name,
          expirationDate: currentPlan.expiryDate,
        }}
      />
    </div>
  );
}
