import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cardHoverVariant } from "@/lib/animation-variants";

interface SuggestionCardProps {
  title: string;
  description: string;
  cta: string;
  href?: string;
  onClick?: () => void;
  span?: boolean;
}

export function SuggestionCard({
  title,
  description,
  cta,
  href,
  onClick,
  span,
}: SuggestionCardProps) {
  const cardContent = (
    <Card className="border-border/30 shadow-none rounded-3xl hover:border-border/50 transition-colors h-full">
      <CardContent className="p-4 space-y-2">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          {description}
        </p>
        <div className="inline-flex items-center text-chart-1 text-[13px] font-medium group">
          {cta}
          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <motion.div
      whileHover="hover"
      variants={cardHoverVariant}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={span ? "sm:col-span-2" : ""}
    >
      {onClick ? (
        <button onClick={onClick} className="w-full text-left">
          {cardContent}
        </button>
      ) : href ? (
        <Link href={href} className="block">
          {cardContent}
        </Link>
      ) : (
        cardContent
      )}
    </motion.div>
  );
}
