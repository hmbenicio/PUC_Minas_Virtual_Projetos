"use client";

import React from "react";
import { Label as LabelPrimitive } from "@radix-ui/react-label";

export const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive
    ref={ref}
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ""}`}
    {...props}
  />
));

Label.displayName = "Label";
