"use client";

import { requestOtpCodeSchema } from "@/actions/authentication/_schema";
import { requestOtpCodeAction } from "@/actions/authentication/request-otp-action";
import { verifyOtpCodeAction } from "@/actions/authentication/verify-otp-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@polaris/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@polaris/ui/form";
import { Input } from "@polaris/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@polaris/ui/input-otp";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

export function LoginForm() {
	const [email, setEmail] = useState("");

	const form = useForm<z.infer<typeof requestOtpCodeSchema>>({
		resolver: zodResolver(requestOtpCodeSchema),
		defaultValues: {
			email: "",
		},
	});

	const requestOtpCode = useAction(requestOtpCodeAction, {
		onSuccess: (data) => {
			toast.success("Check your inbox for a verification code");
			setEmail(data.input.email);
			form.clearErrors();
		},
		onError: (error) => {
			if (error.error.validationErrors) {
				form.setError("email", {
					message: error.error.validationErrors.fieldErrors.email?.[0],
				});
				return;
			}

			toast.error(error.error.serverError);
		},
	});

	const verifyOtpCode = useAction(verifyOtpCodeAction, {
		onSuccess: () => {
			toast.success("Successfully logged in");
		},
		onError: (error) => {
			toast.error(error.error.serverError);
		},
	});

	function onEmailSubmit(values: z.infer<typeof requestOtpCodeSchema>) {
		requestOtpCode.execute(values);
	}

	function onOtpSubmit(token: string) {
		verifyOtpCode.execute({ email, token });
	}

	if (email) {
		return (
			<div className="flex flex-col space-y-4 items-center">
				<InputOTP
					maxLength={6}
					autoFocus
					onComplete={onOtpSubmit}
					render={({ slots }) => (
						<InputOTPGroup>
							{slots.map((slot, index) => (
								<InputOTPSlot
									key={index.toString()}
									{...slot}
									className="w-[62px] h-[62px]"
								/>
							))}
						</InputOTPGroup>
					)}
				/>

				<Button
					variant="ghost"
					className="w-full"
					onClick={() => onEmailSubmit({ email })}
					isLoading={
						requestOtpCode.status === "executing" ||
						verifyOtpCode.status === "executing"
					}
				>
					{verifyOtpCode.status === "executing"
						? "Verifying code"
						: "Resend code"}
				</Button>
			</div>
		);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onEmailSubmit)}>
				<div className="flex flex-col space-y-4">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										placeholder="Enter your email"
										disabled={requestOtpCode.status === "executing"}
										{...field}
										autoCapitalize="false"
										autoCorrect="false"
										spellCheck="false"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						type="submit"
						isLoading={requestOtpCode.status === "executing"}
					>
						Continue with email
					</Button>
				</div>
			</form>
		</Form>
	);
}
