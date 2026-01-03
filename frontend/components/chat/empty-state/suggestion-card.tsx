import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cardHoverVariant } from "@/lib/animation-variants";

interface SuggestionCardProps {
  title: string;
  description: string;
  cta: string;
  href: string;
  span?: boolean;
}

export function SuggestionCard({
  title,
  description,
  cta,
  href,
  span,
}: SuggestionCardProps) {
  return (
    <motion.div
      whileHover="hover"
      variants={cardHoverVariant}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={span ? "sm:col-span-2" : ""}
    >
      <Card className="border-border/30 shadow-none hover:border-border/50 transition-colors">
        <CardContent className="p-3.5 space-y-2">
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-[13px] text-muted-foreground leading-relaxed">
            {description}
          </p>
          <Link
            href={href}
            className="inline-flex items-center text-primary text-[13px] font-medium group"
          >
            {cta}
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  );
}
