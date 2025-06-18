"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, Clock, Zap, Settings } from "lucide-react";
import { useSessions } from "../context/sessionsContext";
import type { PriceRule } from "../types/session.types";

export function PriceRulesModal() {
  const { state, dispatch } = useSessions();
  const { priceRules, isPriceRulesModalOpen } = state;
  const [editingRule, setEditingRule] = useState<PriceRule | null>(null);
  const [autoAcceptEnabled, setAutoAcceptEnabled] = useState(true);

  const handleSaveRule = (rule: PriceRule) => {
    // TODO: Integrate with backend API
    console.log("Saving price rule:", rule);
    setEditingRule(null);
  };

  const RuleEditor = ({ rule }: { rule: PriceRule }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <DollarSign className="h-4 w-4" />
          {rule.sessionType === "individual"
            ? "Individual Sessions"
            : "Group Sessions"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`base-${rule.id}`}>Base Price</Label>
            <Input
              id={`base-${rule.id}`}
              type="number"
              defaultValue={rule.basePrice}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor={`min-${rule.id}`}>Min Bid</Label>
            <Input
              id={`min-${rule.id}`}
              type="number"
              defaultValue={rule.minBidPrice}
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`max-${rule.id}`}>Max Bid</Label>
            <Input
              id={`max-${rule.id}`}
              type="number"
              defaultValue={rule.maxBidPrice}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor={`auto-${rule.id}`}>Auto-Accept Threshold</Label>
            <Input
              id={`auto-${rule.id}`}
              type="number"
              defaultValue={rule.autoAcceptThreshold}
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor={`cutoff-${rule.id}`}>Lead Time Cutoff (hours)</Label>
          <Select defaultValue={rule.leadTimeCutoff.toString()}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12 hours</SelectItem>
              <SelectItem value="24">24 hours</SelectItem>
              <SelectItem value="48">48 hours</SelectItem>
              <SelectItem value="72">72 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          className="w-full bg-[#0E6E55] hover:bg-[#0E6E55]/90"
          onClick={() => handleSaveRule(rule)}
        >
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <Dialog
      open={isPriceRulesModalOpen}
      onOpenChange={() => dispatch({ type: "TOGGLE_PRICE_RULES_MODAL" })}
    >
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Price Rules & Automation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Auto-Accept Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Zap className="h-4 w-4 text-yellow-500" />
                Auto-Accept Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-accept">Enable Auto-Accept</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically accept bids that meet your threshold
                  </p>
                </div>
                <Switch
                  id="auto-accept"
                  checked={autoAcceptEnabled}
                  onCheckedChange={setAutoAcceptEnabled}
                />
              </div>

              {autoAcceptEnabled && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-sm">
                      Auto-Reject Timeline
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Requests will be automatically rejected if no action is
                    taken 48 hours before the session.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Separator />

          {/* Price Rules */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Session Type Rules</h3>
              <Badge variant="outline" className="text-xs">
                {priceRules.length} rules configured
              </Badge>
            </div>

            <div className="grid gap-6">
              {priceRules.map((rule) => (
                <RuleEditor key={rule.id} rule={rule} />
              ))}
            </div>
          </div>

          {/* AI Pricing Suggestions */}
          <Card className="border-[#0E6E55]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Zap className="h-4 w-4 text-[#0E6E55]" />
                AI Pricing Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-[#0E6E55]/5 rounded-lg">
                <p className="text-sm font-medium text-[#0E6E55]">
                  Dynamic Pricing Recommendation
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Based on demand patterns, consider increasing individual
                  session base price to $55 (+10%)
                </p>
                <Button size="sm" variant="outline" className="mt-2">
                  Apply Suggestion
                </Button>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-700">
                  Competitive Analysis
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your pricing is 15% below market average. Consider adjusting
                  for better positioning.
                </p>
                <Button size="sm" variant="outline" className="mt-2">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => dispatch({ type: "TOGGLE_PRICE_RULES_MODAL" })}
            >
              Cancel
            </Button>
            <Button className="bg-[#0E6E55] hover:bg-[#0E6E55]/90">
              Save All Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
