"use client";
import React, { Children } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { CreditCardIcon, StoreIcon } from "lucide-react";
import { usePaymentInputs } from "react-payment-inputs";
import images, { CardImages } from "react-payment-inputs/images";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import UploadFile from "./Upload";

function MeetingUploadModal({children}) {
  const id = useId();
  const {
    meta,
    getCardNumberProps,
    getExpiryDateProps,
    getCVCProps,
    getCardImageProps,
  } = usePaymentInputs();
  const couponInputRef = useRef < HTMLInputElement > null;
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  // Auto-focus the coupon input when it's shown
  useEffect(() => {
    if (showCouponInput && couponInputRef.current) {
      couponInputRef.current.focus();
    }
  }, [showCouponInput]);
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <div className="mb-2 flex flex-col gap-2">
          <DialogHeader>
            <DialogTitle className="text-center">Upload a file </DialogTitle>
            <DialogDescription className="text-center">
              Convert meeting recordings into actionable summaries
            </DialogDescription>
          </DialogHeader>
        </div>
          <UploadFile/>
        
          <Button type="button" className="w-full">
            Summarize
          </Button>
        
      </DialogContent>
    </Dialog>
  );
}

export default MeetingUploadModal;
