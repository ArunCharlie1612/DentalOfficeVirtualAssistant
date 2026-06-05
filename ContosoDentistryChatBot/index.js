// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const path = require('path');
const express = require('express');

// Import required bot services.
const { BotFrameworkAdapter } = require('botbuilder');

// Import bot definition.
const { DentistryBot } = require('./bot');

// Read environment variables from .env file
const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });

// Create HTTP server
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3978;

app.listen(PORT, () => {
    console.log(`\n🦷 Contoso Dentistry Bot listening on port ${PORT}`);
    console.log('\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator');
    console.log('\nTo test your bot, connect to: http://localhost:' + PORT + '/api/messages');
});

// Create adapter.
const adapter = new BotFrameworkAdapter({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Catch-all for errors.
adapter.onTurnError = async (context, error) => {
    console.error(`\n [onTurnError] unhandled error: ${error}`);

    // Send a trace activity
    await context.sendTraceActivity(
        'OnTurnError Trace',
        `${error}`,
        'https://www.botframework.com/schemas/error',
        'TurnError'
    );

    // Send a message to the user
    await context.sendActivity('The bot encountered an error or bug.');
    await context.sendActivity('To continue to run this bot, please fix the bot source code.');
};

// Create the bot instance
const bot = new DentistryBot();

// Listen for incoming requests.
app.post('/api/messages', async (req, res) => {
    await adapter.process(req, res, (context) => bot.run(context));
});

// Simple health check endpoint
app.get('/', (req, res) => {
    res.send('Contoso Dentistry Bot is running!');
});
