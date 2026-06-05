// Simple FAQ fallback when Azure Language service is not configured
// This allows the bot to work without Azure setup for testing

const faqs = [
    {
        questions: ['do you accept insurance', 'insurance', 'do you take insurance'],
        answer: 'Yes, we accept most major dental insurance plans including Delta Dental, Aetna, Cigna, MetLife, and United Healthcare. Please contact our office to verify if we accept your specific plan.'
    },
    {
        questions: ['no insurance', 'without insurance', "don't have insurance", 'uninsured'],
        answer: 'Absolutely! We welcome patients without insurance. We offer competitive self-pay rates and flexible payment plans to make dental care affordable for everyone.'
    },
    {
        questions: ['office hours', 'hours', 'when are you open', 'what time'],
        answer: 'We are open Monday through Friday from 8:00 AM to 6:00 PM, and Saturday from 9:00 AM to 2:00 PM. We are closed on Sundays.'
    },
    {
        questions: ['location', 'where are you', 'address', 'where located'],
        answer: 'Our office is conveniently located at 123 Dental Street, Suite 100, Seattle, WA 98101. We have ample parking available for patients.'
    },
    {
        questions: ['emergency', 'urgent', 'tooth pain', 'toothache'],
        answer: 'Yes, we provide same-day emergency appointments for urgent dental issues such as severe toothaches, broken teeth, or dental trauma. Please call us immediately at (555) 123-4567 if you have a dental emergency.'
    },
    {
        questions: ['first appointment', 'first visit', 'what to bring'],
        answer: 'Please bring a valid photo ID, your insurance card (if applicable), a list of current medications, and any dental records from your previous dentist if available.'
    },
    {
        questions: ['children', 'kids', 'pediatric', 'child'],
        answer: 'Yes, we offer comprehensive pediatric dentistry services for children of all ages. Our team is experienced in providing gentle, caring treatment for young patients.'
    },
    {
        questions: ['how often', 'frequency', 'regular checkup'],
        answer: 'We recommend visiting the dentist every six months for a routine cleaning and examination. However, some patients may need more frequent visits based on their oral health needs.'
    },
    {
        questions: ['whitening', 'white teeth', 'brighten teeth'],
        answer: 'Yes, we offer both in-office professional teeth whitening and take-home whitening kits. Our cosmetic dentistry services can help you achieve the bright, beautiful smile you desire.'
    },
    {
        questions: ['payment', 'pay', 'cost', 'price'],
        answer: 'We accept cash, checks, and all major credit cards (Visa, MasterCard, American Express, Discover). We also offer financing options through CareCredit.'
    },
    {
        questions: ['parking'],
        answer: 'Yes, we have a dedicated parking lot with plenty of free parking spaces for our patients. The parking area is well-lit and conveniently located near the entrance.'
    },
    {
        questions: ['sedation', 'nervous', 'anxiety', 'scared', 'afraid'],
        answer: 'We understand that many patients experience dental anxiety. Our caring team takes extra time to ensure you feel comfortable, and we offer sedation options including nitrous oxide (laughing gas) and oral sedation to help you relax during treatment.'
    },
    {
        questions: ['services', 'what do you do', 'treatments'],
        answer: 'We provide comprehensive dental services including preventive care, cosmetic dentistry, restorative procedures, orthodontics, periodontal care, endodontics (root canals), oral surgery, and emergency dental care.'
    },
    {
        questions: ['financing', 'payment plan', 'afford'],
        answer: 'Yes, we offer flexible payment plans and accept CareCredit financing to help make dental care more affordable. Our staff can discuss available options during your visit.'
    },
    {
        questions: ['cleaning', 'how long'],
        answer: 'A routine dental cleaning typically takes 30-60 minutes, depending on the condition of your teeth and gums. This includes the cleaning, polishing, and examination by the dentist.'
    }
];

function findAnswer(question) {
    const lowerQuestion = question.toLowerCase();
    
    for (const faq of faqs) {
        for (const keyword of faq.questions) {
            if (lowerQuestion.includes(keyword)) {
                return {
                    answer: faq.answer,
                    confidence: 0.8 // Simple matching has decent confidence
                };
            }
        }
    }
    
    return null;
}

module.exports = {
    findAnswer
};
