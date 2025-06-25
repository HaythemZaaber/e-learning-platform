import { Container } from "./Container";
import { TrustBadge } from "../components/ui/TrustBadge";
import { Shield, CheckCircle, FileCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-12 bg-gray-900 text-white">
      <Container>
        <div className="text-center space-y-6">
          <div className="flex justify-center space-x-8 flex-wrap gap-4">
            <TrustBadge icon={Shield} text="SSL Secured" variant="green" />
            <TrustBadge
              icon={CheckCircle}
              text="GDPR Compliant"
              variant="blue"
            />
            <TrustBadge
              icon={FileCheck}
              text="Background Verified"
              variant="purple"
            />
          </div>

          <p className="text-gray-400">Trusted by educators worldwide</p>

          <div className="border-t border-gray-800 pt-6">
            <p className="text-sm text-gray-500">
              © 2024 EduPlatform. All rights reserved. |
              <span className="ml-2">
                Support: help@eduplatform.com | 1-800-EDU-HELP
              </span>
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
