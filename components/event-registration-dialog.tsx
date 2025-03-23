"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { processEventPayment, registerForEvent } from "@/actions/events";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface EventRegistrationDialogProps {
  eventId: string;
  eventName: string;
  isPaid: boolean;
  price: string | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EventRegistrationDialog({
  eventId,
  eventName,
  isPaid,
  price,
  isOpen,
  onOpenChange,
}: EventRegistrationDialogProps) {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);

  // Payment form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handleRegister = async () => {
    if (!user) {
      toast.error("Authentication required", {
        description: "Please sign in to register for events",
      });
      router.push("/sign-in");
      return;
    }

    try {
      setLoading(true);
      const result = await registerForEvent(eventId, user.id);

      if (result.success) {
        if (result.requiresPayment ?? false) {
          // Show payment form
          setRegistrationId(result.registration.id);
          setShowPayment(true);
        } else {
          // Registration complete
          toast.success(`You have successfully registered for ${eventName}`);
          onOpenChange(false);
          router.refresh();
        }
      } else {
        toast.error("Failed to register for the event", {
          description: result.error,
        });
      }
    } catch (error) {
      console.error("Error registering for event:", error);
      toast.error("An unexpected error occurred", {
        description: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!registrationId) return;

    // Validate payment form
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      toast.error("Invalid payment details", {
        description: "Please fill in all payment fields",
      });
      return;
    }

    try {
      setLoading(true);

      // Mock payment processing - in a real app, you'd integrate with a payment gateway
      // For demo purposes, we'll simulate a successful payment
      const txnId = `TXN${Math.floor(Math.random() * 1000000)}`;

      // Process the payment in your backend
      const result = await processEventPayment(registrationId, txnId);

      if (result.success) {
        toast.success(
          `Your payment for ${eventName} has been processed successfully`
        );
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error("Payment failed", { description: result.error });
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("An unexpected error occurred", {
        description: "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {showPayment ? "Complete Payment" : "Register for Event"}
          </DialogTitle>
          <DialogDescription>
            {showPayment
              ? `Please complete your payment of ₹${price} for ${eventName}`
              : `You are registering for ${eventName}`}
          </DialogDescription>
        </DialogHeader>

        {!showPayment ? (
          <div className="py-4">
            <p className="mb-4">
              {isPaid
                ? `This is a paid event. You will need to pay ₹${price} to complete your registration.`
                : "This is a free event. Click register to confirm your participation."}
            </p>
            <DialogFooter>
              <Button
                onClick={handleRegister}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Register"
                )}
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  maxLength={19}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="card-name">Name on Card</Label>
                <Input
                  id="card-name"
                  placeholder="John Doe"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    maxLength={5}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    maxLength={3}
                    type="password"
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                onClick={handlePayment}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  `Pay ₹${price}`
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
