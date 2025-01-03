"use client";

import { I18nProviderClient } from "@/locales/client";
import { Toaster } from "@polaris/ui/sonner";
import { TooltipProvider } from "@polaris/ui/tooltip";
import { NuqsAdapter } from "nuqs/adapters/next/app";

interface ProvidersProps extends React.PropsWithChildren {
	locale: string;
}

export function Providers({ children, locale }: ProvidersProps) {
	return (
		<I18nProviderClient locale={locale}>
			<NuqsAdapter>
				<TooltipProvider>
					{children}
					<Toaster />
				</TooltipProvider>
			</NuqsAdapter>
		</I18nProviderClient>
	);
}
