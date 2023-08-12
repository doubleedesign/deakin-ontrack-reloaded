/**
 * Data types returned by the DeakinSync BFF
 */
export type CallistaUnit = {
	code: string;
	name: string;
	url: string;
	description: string;
	year: number;
	period: 2;
	deliveryMode: 'Cloud' | 'Campus',
	calendarType: 'TRI-1' | 'TRI-2' | 'TRI-3',
	source: 'callista' | 'd2l',
	creditPoints: number
}
