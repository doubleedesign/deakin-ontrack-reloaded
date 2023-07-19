export type BrightspaceAssignment = {
	Id: number;
	CategoryId: unknown;
	Name: string;
	CustomInstructions: unknown;
	Attachments: unknown;
	TotalFiles: number;
	UnreadFiles: number;
	FlaggedFiles: number;
	TotalUsers: number;
	TotalUsersWithSubmissions: number;
	TotalUsersWithFeedback: number;
	Availability: {
		StartDate: string,
		EndDate: string;
		StartDateAvailabilityType: unknown;
		EndDateAvailabilityType: unknown;
	},
	IsHidden: boolean;
	Assessment: {
		ScoreDenominator: number;
		Rubrics: unknown[]
	},
	DropboxType: number,
	GroupTypeId: unknown;
	DueDate: string;
	DisplayInCalendar: boolean;
	NotificationEmail: unknown;
	LinkAttachments: unknown[],
	ActivityId: string;
	IsAnonymous: boolean;
	SubmissionType: number;
	CompletionType: number;
	GradeItemId: number;
}
