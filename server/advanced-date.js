class AdvancedDate extends Date
{
    constructor()
    {
        super();
    }
    // Converts a javascript Date object to MYSQL Datetime
    JavascriptToSQLDatetime(date)
    {
        return date.toISOString().slice(0, 19).replace('T', ' ');
    }
    
    // Get JS Date Object at the start of the week from current day
    GetStartOfWeek()
    {
        var day = this.getDay() || 1;  
        if( day !== 1 ) 
            this.setHours(-24 * (day - 1)); 
        this.setHours(0);
        this.setMinutes(0);
        this.setSeconds(0);
        return this;
    }
}   

module.exports = {AdvancedDate};