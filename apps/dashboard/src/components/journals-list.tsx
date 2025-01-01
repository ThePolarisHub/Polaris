"use client";

import type { changeJournalSchema } from "@/actions/journals/_schema";
import { changeJournalAction } from "@/actions/journals/change-journal-action";
import type { getJournalsQuery } from "@polaris/supabase/queries";
import { Button } from "@polaris/ui/button";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { toast } from "sonner";
import type { z } from "zod";
import { JournalLogo } from "./journal-logo";

interface JournalsListProps {
	journals: Awaited<ReturnType<typeof getJournalsQuery>>;
}

export function JournalsList({ journals }: JournalsListProps) {
	const [selectedJournalId, setSelectedJournalId] = useState<string | null>(
		null,
	);

	const changeJournal = useAction(changeJournalAction, {
		onSuccess: () => {
			toast("Welcome to your journal!", {
				description:
					"You've successfully switched to your selected journal. Happy journaling!",
			});
		},
		onError: (error) => {
			toast("Oops, something went wrong", {
				description:
					"We couldn't switch journals right now. Please try again in a moment.",
			});
			setSelectedJournalId(null);
		},
	});

	function handleChangeJournal(data: z.infer<typeof changeJournalSchema>) {
		changeJournal.execute(data);
	}

	return (
		<div className="border border-border rounded-md">
			<table className="w-full caption-bottom text-sm relative">
				<tbody className="[&_tr:last-child]:border-0">
					{journals.data?.map((journal) => (
						<tr className="border-b hover:bg-transparent" key={journal.id}>
							<td className="px-4 align-middle [&amp;:has([role=checkbox])]:pr-0 last:border-none border-r-[0px] py-4">
								<div className="flex items-center space-x-4">
									<JournalLogo name={journal.name} logoUrl={journal.logo_url} />
									<div className="flex flex-col">
										<span className="font-medium text-sm">{journal.name}</span>
										<span className="text-xs text-muted-foreground">
											{journal.role}
										</span>
									</div>
								</div>
							</td>
							<td className="px-4 py-2 align-middle [&amp;:has([role=checkbox])]:pr-0 border-r last:border-none">
								<div className="flex justify-end items-center">
									<Button
										variant="outline"
										size="sm"
										className="shadow-none"
										disabled={changeJournal.status === "executing"}
										isLoading={
											changeJournal.status === "executing" &&
											selectedJournalId === journal.id
										}
										onClick={() => {
											setSelectedJournalId(journal.id);
											handleChangeJournal({ journalId: journal.id });
										}}
									>
										Launch
									</Button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
