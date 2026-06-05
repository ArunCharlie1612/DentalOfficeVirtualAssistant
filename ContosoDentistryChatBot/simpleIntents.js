// Simple intent recognition fallback when Azure CLU is not configured
// This allows the bot to work without Azure setup for testing

function recognizeIntent(utterance) {
    const lowerUtterance = utterance.toLowerCase();
    
    // GetAvailability intent patterns
    const availabilityKeywords = [
        'available', 'availability', 'openings', 'slots', 'schedule',
        'when can', 'what time', 'show me', 'do you have',
        'free time', 'open time', 'appointment time'
    ];
    
    // ScheduleAppointment intent patterns
    const scheduleKeywords = [
        'schedule', 'book', 'make appointment', 'reserve',
        'i want to', 'i need', 'set up', 'arrange'
    ];
    
    // Check for GetAvailability intent
    for (const keyword of availabilityKeywords) {
        if (lowerUtterance.includes(keyword)) {
            return {
                intent: 'GetAvailability',
                confidence: 0.85,
                entities: []
            };
        }
    }
    
    // Check for ScheduleAppointment intent
    for (const keyword of scheduleKeywords) {
        if (lowerUtterance.includes(keyword)) {
            return {
                intent: 'ScheduleAppointment',
                confidence: 0.85,
                entities: extractDateTimeEntities(utterance)
            };
        }
    }
    
    return {
        intent: 'None',
        confidence: 0,
        entities: []
    };
}

function extractDateTimeEntities(utterance) {
    const entities = [];
    const lowerUtterance = utterance.toLowerCase();
    
    // Simple datetime detection
    const dateKeywords = [
        'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
        'tomorrow', 'today', 'next week', 'this week'
    ];
    
    for (const keyword of dateKeywords) {
        if (lowerUtterance.includes(keyword)) {
            entities.push({
                category: 'DateTime',
                text: keyword,
                confidenceScore: 0.8
            });
        }
    }
    
    return entities;
}

module.exports = {
    recognizeIntent
};
