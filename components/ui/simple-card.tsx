"use client";
import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const SimpleCard = ({
  className,
  children,
  hover = true,
}: {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
}) => {
  return (
    <motion.div
      className={cn("relative rounded-2xl", className)}
      initial={{ scale: 1 }}
      whileHover={hover ? { scale: 1.02 } : {}}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};
