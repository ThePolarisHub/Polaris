import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { Icons } from "../icons";
import { cn } from "../utils/cn";
import { TooltipContent, TooltipTrigger } from "./tooltip";
import { Tooltip } from "./tooltip";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default: "bg-primary text-white hover:bg-primary/90",
				secondary: "bg-slate-200/75 text-foreground hover:bg-slate-100",
				outline:
					"border bg-background font-normal hover:bg-muted hover:text-foreground",
				destructive:
					"bg-destructive text-white hover:bg-destructive/90 hover:ring-4 hover:ring-destructive/20",
				ghost: "hover:bg-slate-100 hover:text-foreground",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-9 px-4 py-2",
				sm: "h-8 rounded-md px-3 text-xs",
				lg: "h-10 rounded-md px-4",
				icon: "h-9 w-9",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	isLoading?: boolean;
	tooltip?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			asChild = false,
			isLoading = false,
			disabled = false,
			tooltip,
			...props
		},
		ref,
	) => {
		const Comp = asChild ? Slot : "button";
		const button = (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				disabled={disabled || isLoading}
				{...props}
			>
				{isLoading && <Icons.SpinnerIcon className="animate-spin" />}
				{props.children}
			</Comp>
		);

		if (tooltip) {
			return (
				<Tooltip>
					<TooltipTrigger asChild>{button}</TooltipTrigger>
					<TooltipContent>{tooltip}</TooltipContent>
				</Tooltip>
			);
		}

		return button;
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
