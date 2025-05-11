import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const AlertMessage = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <Alert className="max-w-full">
      <Info className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};

export default AlertMessage;
