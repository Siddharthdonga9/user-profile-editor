"use client";

import { useAppStore } from "@/lib/store";
import { useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Info } from "lucide-react";

export function Toast() {
  const { toast, hideToast } = useAppStore();

  useEffect(() => {
    if (toast.isVisible) {
      const timer = setTimeout(() => {
        hideToast();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.isVisible, hideToast]);

  if (!toast.isVisible) return null;

  const icons = {
    success: <CheckCircle className="h-4 w-4 text-green-600" />,
    error: <XCircle className="h-4 w-4 text-red-600" />,
    info: <Info className="h-4 w-4 text-blue-600" />,
  };

  const styles = {
    success: "border-green-200 bg-green-50",
    error: "border-red-200 bg-red-50",
    info: "border-blue-200 bg-blue-50",
  };

  return (
    <div className="fixed top-4 right-4 z-50 w-96">
      <Alert className={`${styles[toast.type]} border`}>
        <div className="flex items-center gap-2">
          {icons[toast.type]}
          <AlertDescription className="font-medium">
            {toast.message}
          </AlertDescription>
        </div>
      </Alert>
    </div>
  );
}
