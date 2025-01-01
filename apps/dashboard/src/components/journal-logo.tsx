import { Avatar, AvatarFallback, AvatarImage } from "@polaris/ui/avatar";
import { cn } from "@polaris/ui/cn";

interface JournalLogoProps extends React.HTMLAttributes<HTMLDivElement> {
	name: string;
	logoUrl?: string | null;
}

export function JournalLogo({ name, logoUrl, className }: JournalLogoProps) {
	return (
		<Avatar
			className={cn("rounded-md bg-muted border border-border", className)}
		>
			<AvatarImage src={logoUrl ?? undefined} />
			<AvatarFallback>{name.charAt(0)}</AvatarFallback>
		</Avatar>
	);
}
