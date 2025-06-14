"use client";

import { Shield, Lock, Eye, FileCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function SecurityBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
      <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
        <Shield className="h-3 w-3" />
        SSL Encrypted
      </Badge>
      <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
        <Lock className="h-3 w-3" />
        GDPR Compliant
      </Badge>
      <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
        <Eye className="h-3 w-3" />
        Privacy Protected
      </Badge>
      <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
        <FileCheck className="h-3 w-3" />
        SOC 2 Certified
      </Badge>
    </div>
  );
}
