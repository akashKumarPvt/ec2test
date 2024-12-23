// Convert milliseconds since Unix epoch to a date string
function millisecondsToDate(milliseconds) {
    // Create a new Date object using the milliseconds
    var date = new Date(milliseconds);
  
    // Extract the date components
    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based
    var day = ('0' + date.getDate()).slice(-2);
  
    // Construct the date string in the format "YYYY-MM-DD"
    var dateString = year + '-' + month + '-' + day;
  
    return dateString;
  }
  
  // Example usage
  var timestamp = 1712828611376;
  var dateString = millisecondsToDate(timestamp);
  console.log(dateString); // Output: "2024-05-29"
  