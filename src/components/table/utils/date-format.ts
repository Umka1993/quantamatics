export default function formatDate(date: string): string {
    let result =  date.split(' ')[0];
    return result.replace(/[/]/g, '.');
}