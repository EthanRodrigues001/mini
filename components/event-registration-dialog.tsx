"use client";

import type React from "react";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { registerForEvent, verifyPayment } from "@/actions/events";
import { extractTransactionId } from "@/lib/transaction";
import { useUser } from "@/contexts/UserContext";

interface EventRegistrationDialogProps {
  eventId: string;
  eventName: string;
  isPaid: boolean;
  price: number | string;
  isOpen: boolean;
  qrImage: string;
  onOpenChange: (open: boolean) => void;
}

export function EventRegistrationDialog({
  eventId,
  eventName,
  isPaid,
  price,
  isOpen,
  qrImage,
  onOpenChange,
}: EventRegistrationDialogProps) {
  const router = useRouter();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentTab, setPaymentTab] = useState<"scan" | "manual">("scan");
  const [manualTxnId, setManualTxnId] = useState("");
  const [paymentImage, setPaymentImage] = useState<File | null>(null);
  const [extractedTxnId, setExtractedTxnId] = useState("");
  const [extractionStatus, setExtractionStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPaymentImage(file);
    setExtractionStatus("loading");

    try {
      // Convert file to base64 for Tesseract
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const base64Image = event.target.result.toString();
          const txnId = await extractTransactionId(base64Image);

          if (
            txnId &&
            txnId !== "Transaction ID not found" &&
            txnId !== "Error extracting transaction ID"
          ) {
            setExtractedTxnId(txnId);
            setExtractionStatus("success");
          } else {
            setExtractionStatus("error");
            toast("Extraction Failed", {
              description:
                "Could not extract transaction ID from image. Please enter it manually.",
            });
          }
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error processing image:", error);
      setExtractionStatus("error");
      toast("Processing Error", {
        description:
          "Failed to process the image. Please try again or enter the transaction ID manually.",
      });
    }
  };

  const handleRegistration = async () => {
    if (!user) {
      toast("Authentication Required", {
        description: "Please sign in to register for this event",
      });
      router.push("/sign-in");
      return;
    }

    setIsLoading(true);

    try {
      const txnId = paymentTab === "scan" ? extractedTxnId : manualTxnId;

      if (isPaid && !txnId) {
        toast("Payment Required", {
          description:
            "Please provide a valid transaction ID to complete registration",
        });
        setIsLoading(false);
        return;
      }

      // Verify payment if this is a paid event
      if (isPaid && txnId) {
        const verificationResult = await verifyPayment(txnId);

        if (!verificationResult.success) {
          toast("Verification Failed", {
            description: verificationResult.error || "Failed to verify payment",
          });
          setIsLoading(false);
          return;
        }

        if (verificationResult.isDuplicate) {
          toast("Duplicate Transaction ID", {
            description:
              "This transaction ID has already been used for another registration",
          });
          setIsLoading(false);
          return;
        }
      }

      // Register for the event
      const result = await registerForEvent(eventId, user.id, isPaid, txnId);

      if (result.success) {
        toast("Registration Successful", {
          description: `You have successfully registered for ${eventName}`,
        });

        onOpenChange(false);
        router.refresh();
      } else {
        toast("Registration Failed", {
          description: result.error || "Failed to register for the event",
        });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast("Registration Error", {
        description: "An unexpected error occurred during registration.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Register for {eventName}</DialogTitle>
          <DialogDescription>
            {isPaid
              ? `This is a paid event. Please complete the payment of ₹${price} and provide the transaction details below.`
              : "Complete your registration for this free event."}
          </DialogDescription>
        </DialogHeader>

        {isPaid ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <img
                src={`${qrImage}`}
                alt="Payment QR Code"
                className="max-w-[200px] h-auto border rounded-md"
              />
            </div>

            <Tabs
              value={paymentTab}
              onValueChange={(v) => setPaymentTab(v as "scan" | "manual")}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="scan">Scan Receipt</TabsTrigger>
                <TabsTrigger value="manual">Enter Manually</TabsTrigger>
              </TabsList>

              <TabsContent value="scan" className="space-y-4">
                <div
                  className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {paymentImage ? (
                    <div className="space-y-2 text-center">
                      <img
                        src={
                          URL.createObjectURL(paymentImage) ||
                          "/placeholder.svg"
                        }
                        alt="Payment receipt"
                        className="max-h-[150px] mx-auto rounded-md"
                      />
                      <p className="text-sm text-muted-foreground">
                        {paymentImage.name}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-2">
                      <Upload className="h-10 w-10 text-muted-foreground" />
                      <p className="text-sm font-medium">
                        Upload payment screenshot
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Click to browse or drag and drop
                      </p>
                    </div>
                  )}
                </div>

                {extractionStatus === "loading" && (
                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Extracting transaction ID...</span>
                  </div>
                )}

                {extractionStatus === "success" && (
                  <div className="flex items-center space-x-2 text-sm text-green-600">
                    <Check className="h-4 w-4" />
                    <span>Transaction ID: {extractedTxnId}</span>
                  </div>
                )}

                {extractionStatus === "error" && paymentImage && (
                  <div className="flex items-center space-x-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span>
                      Could not extract transaction ID. Please enter manually.
                    </span>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="manual">
                <div className="space-y-2">
                  <Label htmlFor="txnId">Transaction ID</Label>
                  <Input
                    id="txnId"
                    placeholder="Enter your payment transaction ID"
                    value={manualTxnId}
                    onChange={(e) => setManualTxnId(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter the transaction ID from your payment receipt or UPI
                    app
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="py-4">
            <p className="text-center text-muted-foreground">
              You are about to register for this free event. Click the button
              below to confirm.
            </p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleRegistration}
            disabled={
              isLoading ||
              (isPaid && paymentTab === "scan" && !extractedTxnId) ||
              (isPaid && paymentTab === "manual" && !manualTxnId)
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Complete Registration"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
