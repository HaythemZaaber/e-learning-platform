"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, User, Users, DollarSign } from "lucide-react";
import { Availability, GeneratedSlot } from "@/types/instructorTypes";

interface SimpleBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  availability: Availability | null;
  slot: GeneratedSlot | null;
  instructorName: string;
  individualRate: number;
  groupRate: number;
  onSubmit: (bookingDetails: any) => Promise<boolean>;
}

export function SimpleBookingModal({
  isOpen,
  onClose,
  availability,
  slot,
  instructorName,
  individualRate,
  groupRate,
  onSubmit,
}: SimpleBookingModalProps) {
  const [sessionType, setSessionType] = useState<"individual" | "group">("individual");
  const [topic, setTopic] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [studentInfo, setStudentInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!slot || !availability) return;

    setIsSubmitting(true);
    try {
      const bookingDetails = {
        slotId: slot.id,
        sessionType,
        duration: slot.slotDuration,
        topic,
        offerPrice: sessionType === "individual" ? individualRate : groupRate,
        specialRequirements,
        studentInfo,
        timestamp: new Date().toISOString(),
      };

      const success = await onSubmit(bookingDetails);
      if (success) {
        onClose();
        // Reset form
        setSessionType("individual");
        setTopic("");
        setSpecialRequirements("");
        setStudentInfo({ name: "", email: "", phone: "" });
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!slot || !availability) return null;

  const slotDate = new Date(slot.startTime);
  const formattedDate = slotDate.toLocaleDateString();
  const formattedTime = slotDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Book Session with {instructorName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Session Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{formattedTime} ({slot.slotDuration} minutes)</span>
            </div>
          </div>

          {/* Session Type */}
          <div className="space-y-3">
            <Label>Session Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={sessionType === "individual" ? "default" : "outline"}
                onClick={() => setSessionType("individual")}
                className="justify-start"
              >
                <User className="h-4 w-4 mr-2" />
                Individual
                <span className="ml-auto">${individualRate}</span>
              </Button>
              <Button
                variant={sessionType === "group" ? "default" : "outline"}
                onClick={() => setSessionType("group")}
                className="justify-start"
              >
                <Users className="h-4 w-4 mr-2" />
                Group
                <span className="ml-auto">${groupRate}</span>
              </Button>
            </div>
          </div>

          {/* Topic */}
          <div className="space-y-2">
            <Label htmlFor="topic">Session Topic *</Label>
            <Input
              id="topic"
              placeholder="What would you like to learn about?"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          {/* Special Requirements */}
          <div className="space-y-2">
            <Label htmlFor="requirements">Special Requirements</Label>
            <Textarea
              id="requirements"
              placeholder="Any specific needs or preparation requests?"
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
              rows={3}
            />
          </div>

          {/* Student Information */}
          <div className="space-y-3">
            <Label>Your Information</Label>
            <div className="space-y-2">
              <Input
                placeholder="Full Name *"
                value={studentInfo.name}
                onChange={(e) => setStudentInfo(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                type="email"
                placeholder="Email *"
                value={studentInfo.email}
                onChange={(e) => setStudentInfo(prev => ({ ...prev, email: e.target.value }))}
              />
              <Input
                type="tel"
                placeholder="Phone Number *"
                value={studentInfo.phone}
                onChange={(e) => setStudentInfo(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">Total:</span>
            <span className="text-xl font-bold">
              ${sessionType === "individual" ? individualRate : groupRate}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!topic || !studentInfo.name || !studentInfo.email || !studentInfo.phone || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Booking..." : "Book Session"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

