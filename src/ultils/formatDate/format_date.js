export function formatDate(dateString, format) {
    let date = new Date(dateString);

    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    
    if (format === "yy/mm/dd") {
        return `${year}-${month}-${day}`;
    } else if (format === "dd/mm/yy") {
        return `${day}-${month}-${year}`;
    } else {
        throw new Error("Invalid format");
    }
}



export function getAge(dateString) {
    var birthDateString = dateString;
    var birthDate = new Date(birthDateString);
    var today = new Date();
    var age = today.getUTCFullYear() - birthDate.getUTCFullYear();

    if (today.getUTCMonth() < birthDate.getUTCMonth() || (today.getUTCMonth() === birthDate.getUTCMonth() && today.getUTCDate() < birthDate.getUTCDate())) {
        age--;
    }
    return age;

}



export function calculateDaysWorked(startDate) {
    const currentDate = new Date();
    const startDateTime = new Date(startDate).getTime();
    const currentDateTime = currentDate.getTime();
  
    if (isNaN(startDateTime)) {
      return 'Invalid start date';
    }
  
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const daysWorked = Math.floor((currentDateTime - startDateTime) / millisecondsPerDay);
  
    return daysWorked;
  }
  