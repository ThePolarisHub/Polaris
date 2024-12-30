"use client";

import { updateProfileSchema } from "@/actions/authentication/_schema";
import { AVATAR_ACCEPTED_IMAGE_TYPES } from "@/utils/configuration";
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
import { useRef } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

export function SetupProfileForm() {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const form = useForm<z.infer<typeof updateProfileSchema>>({
		resolver: zodResolver(updateProfileSchema),
		defaultValues: {
			display_name: "",
		},
	});

	const avatarFile = form.watch("avatar");
	const avatarPreviewUrl = avatarFile
		? URL.createObjectURL(avatarFile)
		: undefined;

	function onSubmit(values: z.infer<typeof updateProfileSchema>) {
		console.log(values);
	}

	return (
		<Form {...form}>
			<form
				className="flex flex-col space-y-8"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<FormField
					control={form.control}
					name="avatar"
					render={({ field: { onChange, value, ...field } }) => (
						<FormItem>
							<FormControl>
								<div className="flex items-end space-x-4">
									<Avatar className="w-20 h-20 rounded-md border border-border">
										<AvatarImage src={avatarPreviewUrl} />
										<AvatarFallback className="rounded-md">
											<Icons.NoImageIcon className="w-5 h-5 text-muted-foreground/50" />
										</AvatarFallback>
									</Avatar>
									<input
										type="file"
										accept={AVATAR_ACCEPTED_IMAGE_TYPES.join(",")}
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
										onClick={() => fileInputRef.current?.click()}
									>
										Choose avatar
									</Button>
								</div>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="display_name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Display name</FormLabel>
							<FormControl>
								<Input placeholder="John Doe" {...field} />
							</FormControl>
							<FormDescription>
								Your display name is how other users will see you.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button className="w-full">Save profile</Button>
			</form>
		</Form>
	);
}
