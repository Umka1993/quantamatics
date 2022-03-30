export function checkDateInputSupport() {
	// if (navigator.userAgent.includes('Safari') && navigator.userAgent.includes('Mac OS')) {
	// 	return false;
	// }

	const input = document.createElement('input');
	input.setAttribute('type','date');
	const notADateValue = 'not-a-date';
	input.setAttribute('value', notADateValue);

	return (input.value !== notADateValue);
}

export function formatToValue(value: Date | undefined): string {
	const dataToFormat = value ? value : new Date();
	const temp = dataToFormat
		.toLocaleDateString("en-US", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		})
		.split("/");
	const result = `${temp[2]}-${temp[0]}-${temp[1]}`;
	return result;
}

export function formatDate(date: Date): string {
	return date.toLocaleDateString("en-US", {
		month: "2-digit",
		day: "2-digit",
		year: "numeric",
	});
}
