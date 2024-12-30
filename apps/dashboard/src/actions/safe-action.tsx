import {
	DEFAULT_SERVER_ERROR_MESSAGE,
	createSafeActionClient,
	flattenValidationErrors,
} from "next-safe-action";

export const actionClient = createSafeActionClient({
	handleServerError: (error) => {
		if (error instanceof Error) {
			return error.message;
		}

		return DEFAULT_SERVER_ERROR_MESSAGE;
	},
	defaultValidationErrorsShape: "flattened",
});
