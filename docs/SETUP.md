# Detailed Setup Guide

This guide walks you through setting up the Dental Office Virtual Assistant from scratch.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Environment Setup](#local-environment-setup)
3. [Azure Resources Setup](#azure-resources-setup)
4. [QnA Maker Configuration](#qna-maker-configuration)
5. [LUIS Configuration](#luis-configuration)
6. [Bot Configuration](#bot-configuration)
7. [Testing](#testing)

## Prerequisites

### Software Requirements

1. **Visual Studio Code**
   - Download: https://code.visualstudio.com/download
   - Install recommended extensions: ESLint, Prettier

2. **Node.js (v18 or higher)**
   - Download: https://nodejs.org/en/
   - Verify installation: `node --version`

3. **Bot Framework Emulator**
   - Download: https://github.com/Microsoft/BotFramework-Emulator/releases/tag/v4.13.0
   - Latest version recommended

4. **Git**
   - Download: https://git-scm.com/downloads
   - Configure with your name and email

### Azure Account

- Sign up for free: https://azure.microsoft.com/free/
- $200 credit for new users
- Free tier available for most services

## Local Environment Setup

### 1. Clone/Fork the Repository

```bash
# Fork on GitHub first, then clone your fork
git clone https://github.com/YOUR-USERNAME/DentalOfficeVirtualAssistant.git
cd DentalOfficeVirtualAssistant
```

### 2. Install ChatBot Dependencies

```bash
cd ContosoDentistryChatBot
npm install
```

Expected packages:
- botbuilder
- botbuilder-ai
- dotenv
- restify
- axios

### 3. Install Scheduler API Dependencies

```bash
cd ../ContosoDentistryScheduler
npm install
```

Expected packages:
- express
- cors
- body-parser

## Azure Resources Setup

### 1. Create Resource Group

1. Log in to [Azure Portal](https://portal.azure.com)
2. Click "Create a resource"
3. Search for "Resource group"
4. Click "Create"
5. Enter details:
   - **Subscription**: Your subscription
   - **Resource group**: `DentalOfficeVirtualAssistant-RG`
   - **Region**: Choose closest to you (e.g., West US 2)
6. Click "Review + create" then "Create"

### 2. Create Azure Bot Resource

1. In Azure Portal, click "Create a resource"
2. Search for "Azure Bot"
3. Click "Create"
4. Configure:
   - **Bot handle**: `contoso-dentistry-bot` (must be unique)
   - **Subscription**: Your subscription
   - **Resource group**: `DentalOfficeVirtualAssistant-RG`
   - **Pricing tier**: F0 (Free)
   - **Microsoft App ID**: Create new
   - **Type of App**: Multi Tenant
5. Click "Review + create" then "Create"

6. After creation, go to the Bot resource
7. Navigate to "Configuration" under Settings
8. Copy the **Microsoft App ID** (save this!)
9. Click "Manage Password"
10. Create new client secret
11. Copy the **Value** immediately (save this as Microsoft App Password!)

### 3. Create App Service for ChatBot

1. Click "Create a resource"
2. Search for "Web App"
3. Configure:
   - **Name**: `contoso-dentistry-chatbot`
   - **Runtime stack**: Node 18 LTS
   - **Region**: Same as resource group
   - **Pricing plan**: F1 (Free)
4. Click "Review + create" then "Create"

### 4. Create App Service for Scheduler API

1. Click "Create a resource"
2. Search for "Web App"
3. Configure:
   - **Name**: `contoso-dentistry-scheduler`
   - **Runtime stack**: Node 18 LTS
   - **Region**: Same as resource group
   - **Pricing plan**: F1 (Free)
4. Click "Review + create" then "Create"

### 5. Configure Bot Messaging Endpoint

1. Go to your Bot resource
2. Navigate to "Configuration"
3. Set **Messaging endpoint**: 
   ```
   https://contoso-dentistry-chatbot.azurewebsites.net/api/messages
   ```
   (Replace with your actual App Service URL)
4. Click "Apply"

## QnA Maker Configuration

### 1. Create QnA Maker Resource

1. Go to [QnA Maker Portal](https://www.qnamaker.ai/)
2. Sign in with Azure credentials
3. Click "Create a knowledge base"
4. **Step 1**: Create QnA service in Azure
   - Click the link to Azure Portal
   - Create "QnA Maker" resource:
     - **Name**: `contoso-dentistry-qna`
     - **Pricing tier**: Free F0
     - **Resource group**: `DentalOfficeVirtualAssistant-RG`
5. Return to QnA Maker portal

### 2. Create Knowledge Base

1. **Step 2**: Connect your QnA service
   - Select your Azure AD
   - Select your Azure subscription
   - Select your QnA service

2. **Step 3**: Name your KB
   - **Name**: `ContosoDentistryFAQ`

3. **Step 4**: Populate your KB
   - Click "Add file"
   - Upload `ContosoDentistryFAQs/FAQ.tsv`

4. **Step 5**: Create your KB
   - Click "Create your KB"

### 3. Train and Publish

1. Review the imported Q&A pairs
2. Click "Save and train"
3. Click "Publish"
4. After publishing, note the following from the sample code:
   - **Knowledge Base ID**
   - **Endpoint Key**
   - **Host** (e.g., `https://contoso-dentistry-qna.azurewebsites.net/qnamaker`)

## LUIS Configuration

### 1. Create LUIS Resource

1. Go to [LUIS Portal](https://www.luis.ai/)
2. Sign in with Azure credentials
3. Create new resource in Azure:
   - **Name**: `contoso-dentistry-luis`
   - **Pricing tier**: F0 (Free)
   - **Resource group**: `DentalOfficeVirtualAssistant-RG`

### 2. Create LUIS App

1. In LUIS portal, click "New app"
2. **Name**: `ContosoDentistryLUIS`
3. **Culture**: English
4. Click "Done"

### 3. Create Intents

#### GetAvailability Intent

1. Click "Intents" in left menu
2. Click "Create new intent"
3. **Name**: `GetAvailability`
4. Add example utterances:
   ```
   What appointments are available?
   Show me available times
   Do you have any openings?
   When can I schedule?
   What times do you have?
   Are there any slots available?
   Show available appointment times
   What's available this week?
   Do you have any appointments?
   When are you available?
   ```

#### ScheduleAppointment Intent

1. Click "Create new intent"
2. **Name**: `ScheduleAppointment`
3. Add example utterances:
   ```
   I want to schedule an appointment
   Book an appointment
   Schedule a visit
   I need to see a dentist
   Make an appointment
   Can I book a time slot?
   I'd like to schedule for Monday
   Book me for tomorrow at 2pm
   Schedule an appointment for next week
   I want to come in on Friday
   ```

4. For utterances with dates/times, label them:
   - Highlight "Monday" → Select "datetimeV2" entity
   - Highlight "tomorrow at 2pm" → Select "datetimeV2" entity

### 4. Train and Publish

1. Click "Train" in top right
2. Wait for training to complete
3. Click "Publish" in top right
4. Select "Production" slot
5. Click "Publish"
6. Go to "Manage" → "Azure Resources"
7. Note the following:
   - **App ID**
   - **Primary Key** (Endpoint Key)
   - **Endpoint URL** (extract hostname)

## Bot Configuration

### 1. Configure Local Environment

1. Open `ContosoDentistryChatBot/.env`
2. Fill in all values:

```env
MicrosoftAppId=<your-bot-app-id>
MicrosoftAppPassword=<your-bot-app-password>
PORT=3978

QnAKnowledgebaseId=<your-qna-kb-id>
QnAEndpointKey=<your-qna-endpoint-key>
QnAEndpointHostName=<your-qna-hostname>

LuisAppId=<your-luis-app-id>
LuisAPIKey=<your-luis-api-key>
LuisAPIHostName=<your-luis-hostname>

ContosoDentistrySchedulerAPI=http://localhost:3000
```

### 2. Configure Azure App Service

1. Go to your ChatBot App Service
2. Navigate to "Configuration" under Settings
3. Add all environment variables from .env as Application Settings
4. Update `ContosoDentistrySchedulerAPI` to your Scheduler API URL:
   ```
   https://contoso-dentistry-scheduler.azurewebsites.net
   ```
5. Click "Save"

## Testing

### Test Locally

1. **Start Scheduler API**
   ```bash
   cd ContosoDentistryScheduler
   npm start
   ```
   Should run on `http://localhost:3000`

2. **Start ChatBot**
   ```bash
   cd ContosoDentistryChatBot
   npm start
   ```
   Should run on `http://localhost:3978`

3. **Test with Emulator**
   - Open Bot Framework Emulator
   - Click "Open Bot"
   - Enter: `http://localhost:3978/api/messages`
   - Click "Connect"

4. **Test Conversations**
   - "What appointments are available?" (should trigger LUIS)
   - "I don't have insurance. Can I still be seen?" (should trigger QnA)
   - "Do you accept insurance?" (should trigger QnA)

### Test in Azure

1. Deploy bot to Azure (see Deployment Guide)
2. Go to Bot resource in Azure Portal
3. Click "Test in Web Chat"
4. Test the same conversations

## Next Steps

- [Deployment Guide](DEPLOYMENT.md) - Deploy to Azure
- [API Documentation](API.md) - API reference
- [Troubleshooting](TROUBLESHOOTING.md) - Common issues

## Common Issues

### Bot doesn't respond
- Check .env configuration
- Verify QnA Maker and LUIS are published
- Check Bot Framework Emulator logs

### QnA Maker not working
- Ensure knowledge base is published
- Verify endpoint key and KB ID
- Check QnA Maker portal for errors

### LUIS not recognizing intents
- Train the LUIS model
- Publish to production slot
- Add more example utterances

## Support

For issues, please check the [Troubleshooting Guide](TROUBLESHOOTING.md) or open an issue on GitHub.
