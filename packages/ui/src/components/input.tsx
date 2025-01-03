import * as React from "react";
import { cn } from "../utils/cn";
import { useFormField } from "./form";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
	({ className, type, ...props }, ref) => {
		// Safely try to get form context - will return undefined if not in a form context
		let formField = undefined;

		try {
			formField = useFormField();
		} catch {
			formField = undefined;
		}

		return (
			<input
				type={type}
				className={cn(
					"flex h-9 w-full rounded-md border bg-transparent px-3 py-1 outline-none text-base focus:outline-none shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus:border-ring",
					formField?.error &&
						"border-destructive/80 focus-visible:border-destructive/80 focus-visible:ring-destructive/20",
					className,
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);
Input.displayName = "Input";

export { Input };
