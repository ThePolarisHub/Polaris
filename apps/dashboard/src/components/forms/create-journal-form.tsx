"use client";

import { createJournalSchema } from "@/actions/journals/_schema";
import { createJournalAction } from "@/actions/journals/create-journal-action";

import { JOURNAL_LOGO_ACCEPTED_IMAGE_TYPES } from "@/utils/configuration";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback, AvatarImage } from "@polaris/ui/avatar";
import { Button } from "@polaris/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@polaris/ui/form";
import { Icons } from "@polaris/ui/icons";
import { Input } from "@polaris/ui/input";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

export function CreateJournalForm() {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | undefined>(
		undefined,
	);

	const form = useForm<z.infer<typeof createJournalSchema>>({
		resolver: zodResolver(createJournalSchema),
		defaultValues: {
			name: "",
		},
	});

	const logoFile = form.watch("logo");

	useEffect(() => {
		if (logoFile) {
			const url = URL.createObjectURL(logoFile);
			setLogoPreviewUrl(url);
			return () => URL.revokeObjectURL(url);
		}
	}, [logoFile]);

	const createJournal = useAction(createJournalAction, {
		onSuccess: () => {
			toast("Journal created", {
				description: "Your journal has been created successfully.",
			});
		},
		onError: (error) => {
			if (error.error.validationErrors) {
				form.setError("name", {
					message: error.error.validationErrors.fieldErrors.name?.[0],
				});
				return;
			}

			toast("Oops, something went wrong", {
				description:
					"We couldn't create your journal. Please try again in a moment.",
			});
		},
	});

	function onSubmit(values: z.infer<typeof createJournalSchema>) {
		createJournal.execute(values);
	}

	return (
		<Form {...form}>
			<form
				className="flex flex-col space-y-8"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<FormField
					control={form.control}
					name="logo"
					render={({ field: { onChange, value, ...field } }) => (
						<FormItem>
							<FormControl>
								<div className="flex items-end space-x-4">
									<Avatar className="w-20 h-20 rounded-md border border-border">
										<AvatarImage src={logoPreviewUrl ?? undefined} />
										<AvatarFallback className="rounded-md">
											<Icons.NoImageIcon className="w-5 h-5 text-muted-foreground/50" />
										</AvatarFallback>
									</Avatar>
									<input
										type="file"
										accept={JOURNAL_LOGO_ACCEPTED_IMAGE_TYPES.join(",")}
										className="hidden"
										onChange={(e) => {
											const file = e.target.files?.[0];
											if (file) {
												onChange(file);
											}
										}}
										{...field}
										ref={fileInputRef}
									/>
									<Button
										size="sm"
										variant="outline"
										className="shadow-none"
										type="button"
										disabled={createJournal.status === "executing"}
										onClick={() => fileInputRef.current?.click()}
									>
										Choose logo
									</Button>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Journal name</FormLabel>
							<FormControl>
								<Input
									placeholder="My Journal"
									disabled={createJournal.status === "executing"}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button
					className="w-full"
					isLoading={createJournal.status === "executing"}
				>
					Create journal
				</Button>
			</form>
		</Form>
	);
}
