export default function CalculateAge(date_of_birth) {
    var dob = new Date(date_of_birth);
    var month_diff = Date.now() - dob.getTime();
    var age_dt = new Date(month_diff); 
    var year = age_dt.getUTCFullYear();
    return Math.abs(year - 1970);
};
