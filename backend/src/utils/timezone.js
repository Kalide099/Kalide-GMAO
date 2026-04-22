/**
 * Utility to handle formatting UTC dates into correct ISO formats preserving tenant timezones for UI consumption.
 */

exports.formatToTenantTimezone = (date, timezoneString) => {
    if (!date) return null;
    
    // In a full implementation, you'd integrate 'date-fns-tz' or 'moment-timezone'
    // For this boilerplate, we'll demonstrate a native Intl implementation.
    
    try {
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezoneString || 'UTC',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        
        // This returns "MM/DD/YYYY, HH:mm:ss" natively relative to their timezone.
        // The UI handles standard ISO mapping from strings.
        return formatter.format(new Date(date));
    } catch(err) {
        // Fallback to UTC if timezone is weird
        return new Date(date).toISOString();
    }
};

/**
 * Validates if the given timezone exists.
 */
exports.isValidTimezone = (tz) => {
    try {
        Intl.DateTimeFormat(undefined, { timeZone: tz });
        return true;
    } catch (e) {
        return false;
    }
};
