"use client";

import { I18nProviderClient } from "@/locales/client";
import { Toaster } from "@polaris/ui/sonner";

interface ProvidersProps extends React.PropsWithChildren {
	locale: string;
}

export function Providers({ children, locale }: ProvidersProps) {
	return (
		<I18nProviderClient locale={locale}>
			{children}
			<Toaster />
		</I18nProviderClient>
	);
}
