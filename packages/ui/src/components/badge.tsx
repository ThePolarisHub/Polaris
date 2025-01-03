import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "../utils/cn";

const badgeVariants = cva(
	"inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
	{
		variants: {
			variant: {
				default: "border-transparent bg-primary text-primary-foreground shadow",
				secondary:
					"border-transparent bg-muted text-foreground hover:bg-muted/80",
				destructive:
					"border-transparent bg-destructive/20 text-background shadow",
				success: "border-transparent bg-success/20 text-background",
				outline: "text-foreground",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

export interface BadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
	return (
		<div className={cn(badgeVariants({ variant }), className)} {...props} />
	);
}

export { Badge, badgeVariants };
