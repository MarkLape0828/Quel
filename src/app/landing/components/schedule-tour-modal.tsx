
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter, // Added DialogFooter
} from "@/components/ui/dialog";
import { ScheduleTourForm } from "./schedule-tour-form";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";

interface ScheduleTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ScheduleTourModal({ isOpen, onClose }: ScheduleTourModalProps) {
  const handleFormSuccess = () => {
    // Optionally, keep the modal open for a bit to show a success message within it,
    // or close it immediately. Toaster is already handled by the form.
    onClose(); 
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card">
        <DialogHeader className="text-center sm:text-left">
          <DialogTitle className="text-2xl font-bold">Schedule Your Visit</DialogTitle>
          <DialogDescription>
            We&apos;d love to show you around {APP_NAME}! Please fill out the form below, and one of our representatives will contact you to confirm your tour.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 mb-6">
          <ScheduleTourForm onFormSubmitSuccess={handleFormSuccess} />
        </div>
        {/* DialogFooter can be used if the submit button is outside the form component, 
            but here the form handles its own submission button.
            A close button here might be redundant with the X icon.
        */}
        {/* <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
