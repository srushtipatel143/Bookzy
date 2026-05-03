export function dateFormat(dateValue:string){
    const date = new Date(dateValue);

    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
    const year = date.getUTCFullYear();

    const formattedDate = `${day} ${month}, ${year}`;
    return formattedDate;

}