import { Avatar, AvatarFallback, AvatarImage } from "@polaris/ui/avatar";
import { cn } from "@polaris/ui/cn";

interface ProfileAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
	name: string;
	avatarUrl?: string | null;
}

export function ProfileAvatar({
	name,
	avatarUrl,
	className,
}: ProfileAvatarProps) {
	return (
		<Avatar
			className={cn("rounded-md bg-muted border border-border", className)}
		>
			<AvatarImage src={avatarUrl ?? undefined} />
			<AvatarFallback>{name.charAt(0)}</AvatarFallback>
		</Avatar>
	);
}
