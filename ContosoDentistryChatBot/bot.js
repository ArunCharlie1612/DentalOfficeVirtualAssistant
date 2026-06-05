// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, MessageFactory } = require('botbuilder');
const axios = require('axios');

// Simple FAQ and Intent fallback for when Azure Language is not configured
const simpleFAQ = require('./simpleFAQ');
const simpleIntents = require('./simpleIntents');

class DentistryBot extends ActivityHandler {
    constructor() {
        super();

        // Initialize Azure AI Language Service
        // Single service handles both Q&A and CLU (Conversational Language Understanding)
        if (process.env.LanguageEndpoint && process.env.LanguageApiKey) {
            this.languageEndpoint = process.env.LanguageEndpoint;
            this.languageApiKey = process.env.LanguageApiKey;
            
            // Question Answering configuration (replaces QnA Maker)
            this.qaProjectName = process.env.QAProjectName || 'ContosoDentistryFAQ';
            this.qaDeploymentName = process.env.QADeploymentName || 'production';
            
            // CLU configuration (replaces deprecated LUIS)
            this.cluProjectName = process.env.CLUProjectName || 'ContosoDentistryScheduling';
            this.cluDeploymentName = process.env.CLUDeploymentName || 'production';
            
            console.log('✓ Azure AI Language Service configured');
            console.log('  - Question Answering ready');
            console.log('  - CLU (Intent Recognition) ready');
        } else {
            console.log('⚠ Azure AI Language not configured - using simple fallback');
            this.useFallback = true;
        }

        // Store the scheduler API endpoint
        this.schedulerApiEndpoint = process.env.ContosoDentistrySchedulerAPI || 'http://localhost:3000';
        console.log(`✓ Scheduler API: ${this.schedulerApiEndpoint}`);

        // Handle messages from users
        this.onMessage(async (context, next) => {
            console.log('Processing a message activity...');

            const userMessage = context.activity.text;

            // Get FAQ answers
            let faqAnswer = null;
            let faqConfidence = 0;

            if (this.useFallback) {
                // Use simple FAQ fallback
                const result = simpleFAQ.findAnswer(userMessage);
                if (result) {
                    faqAnswer = result.answer;
                    faqConfidence = result.confidence;
                }
            } else {
                // Use Azure AI Language Question Answering
                try {
                    const faqResult = await this.getQuestionAnswer(userMessage);
                    if (faqResult) {
                        faqAnswer = faqResult.answer;
                        faqConfidence = faqResult.confidence;
                    }
                } catch (error) {
                    console.error('Question Answering error:', error.message);
                }
            }

            // Get intent from CLU (Conversational Language Understanding)
            let topIntent = 'None';
            let entities = [];
            let intentConfidence = 0;
            
            if (this.useFallback) {
                // Use simple intent recognition fallback
                const intentResult = simpleIntents.recognizeIntent(userMessage);
                topIntent = intentResult.intent;
                intentConfidence = intentResult.confidence;
                entities = intentResult.entities;
            } else {
                // Use Azure CLU for intent recognition
                try {
                    const cluResult = await this.analyzeCLU(userMessage);
                    if (cluResult) {
                        topIntent = cluResult.topIntent;
                        intentConfidence = cluResult.confidence;
                        entities = cluResult.entities;
                    }
                } catch (error) {
                    console.error('CLU error:', error.message);
                }
            }

            console.log(`Intent: ${topIntent} (confidence: ${intentConfidence.toFixed(2)})`);

            // Determine action based on intent
            if ((topIntent === 'GetAvailability' || topIntent === 'ScheduleAppointment') 
                && intentConfidence > 0.6) {
                
                if (topIntent === 'GetAvailability') {
                    await this.handleGetAvailability(context);
                } else if (topIntent === 'ScheduleAppointment') {
                    await this.handleScheduleAppointment(context, entities);
                }
            } else if (faqAnswer && faqConfidence > 0.5) {
                // FAQ found a good answer
                await context.sendActivity(faqAnswer);
            } else {
                // No good match found
                await context.sendActivity(
                    "I'm not sure I understand. You can ask me about:\n" +
                    "- Appointment availability\n" +
                    "- Scheduling appointments\n" +
                    "- Insurance questions\n" +
                    "- General dentistry FAQs"
                );
            }

            await next();
        });

        // Handle new members joining the conversation
        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            
            // Custom greeting message
            const welcomeText = 
                "👋 Welcome to Contoso Dentistry!\n\n" +
                "I'm your virtual dental assistant, here to help you with:\n" +
                "- **Scheduling appointments** - Just ask 'What appointments are available?' or 'Schedule an appointment'\n" +
                "- **Insurance questions** - Ask about insurance coverage and policies\n" +
                "- **General information** - Hours, location, services, and more\n\n" +
                "How can I assist you today?";

            for (const member of membersAdded) {
                if (member.id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText));
                }
            }
            
            await next();
        });
    }

    /**
     * Handle getting available appointments
     */
    async handleGetAvailability(context) {
        try {
            const response = await axios.get(`${this.schedulerApiEndpoint}/api/availability`);
            
            if (response.data && response.data.length > 0) {
                let message = "Here are our available appointment times:\n\n";
                response.data.forEach((slot, index) => {
                    message += `${index + 1}. ${slot}\n`;
                });
                message += "\nWould you like to schedule one of these times?";
                await context.sendActivity(message);
            } else {
                await context.sendActivity("I'm sorry, there are no available appointments at this time. Please call our office at (555) 123-4567.");
            }
        } catch (error) {
            console.error('Error fetching availability:', error.message);
            await context.sendActivity("I'm having trouble accessing our scheduling system. Please try again later or call us at (555) 123-4567.");
        }
    }

    /**
     * Handle scheduling an appointment
     */
    async handleScheduleAppointment(context, entities) {
        try {
            // Extract datetime entity if available
            let appointmentTime = null;
            if (entities && entities.length > 0) {
                const dateEntity = entities.find(e => e.category === 'datetime' || e.category === 'DateTime');
                if (dateEntity) {
                    appointmentTime = dateEntity.text;
                }
            }

            if (appointmentTime) {
                // Make API call to schedule appointment
                const response = await axios.post(`${this.schedulerApiEndpoint}/api/schedule`, {
                    time: appointmentTime
                });

                if (response.data.success) {
                    await context.sendActivity(`Great! Your appointment has been scheduled for ${response.data.appointmentTime}. We'll send you a confirmation email shortly.`);
                } else {
                    await context.sendActivity("I'm sorry, that time slot is no longer available. Would you like to see other available times?");
                }
            } else {
                // No time specified, show available times
                await context.sendActivity("I'd be happy to help you schedule an appointment. Let me show you our available times.");
                await this.handleGetAvailability(context);
            }
        } catch (error) {
            console.error('Error scheduling appointment:', error.message);
            await context.sendActivity("I'm having trouble scheduling your appointment. Please try again later or call us at (555) 123-4567.");
        }
    }

    /**
     * Get answer from Azure AI Language Question Answering
     */
    async getQuestionAnswer(question) {
        try {
            const url = `${this.languageEndpoint}/language/:query-knowledgebases?api-version=2021-10-01`;
            
            const response = await axios.post(url, {
                question: question,
                top: 1,
                confidenceScoreThreshold: 0.5,
                includeUnstructuredSources: true
            }, {
                headers: {
                    'Ocp-Apim-Subscription-Key': this.languageApiKey,
                    'Content-Type': 'application/json'
                },
                params: {
                    projectName: this.qaProjectName,
                    deploymentName: this.qaDeploymentName
                }
            });

            if (response.data && response.data.answers && response.data.answers.length > 0) {
                const topAnswer = response.data.answers[0];
                return {
                    answer: topAnswer.answer,
                    confidence: topAnswer.confidenceScore
                };
            }
            return null;
        } catch (error) {
            console.error('Error querying Question Answering:', error.message);
            return null;
        }
    }

    /**
     * Analyze intent using Conversational Language Understanding (CLU)
     * Replaces deprecated LUIS functionality
     */
    async analyzeCLU(text) {
        try {
            const url = `${this.languageEndpoint}/language/:analyze-conversations?api-version=2022-10-01-preview`;
            
            const response = await axios.post(url, {
                kind: 'Conversation',
                analysisInput: {
                    conversationItem: {
                        id: '1',
                        participantId: '1',
                        text: text
                    }
                },
                parameters: {
                    projectName: this.cluProjectName,
                    deploymentName: this.cluDeploymentName,
                    stringIndexType: 'TextElement_V8'
                }
            }, {
                headers: {
                    'Ocp-Apim-Subscription-Key': this.languageApiKey,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data && response.data.result && response.data.result.prediction) {
                const prediction = response.data.result.prediction;
                return {
                    topIntent: prediction.topIntent,
                    confidence: prediction.intents[0]?.confidenceScore || 0,
                    entities: prediction.entities || []
                };
            }
            return null;
        } catch (error) {
            console.error('Error analyzing with CLU:', error.message);
            return null;
        }
    }
}

module.exports.DentistryBot = DentistryBot;
