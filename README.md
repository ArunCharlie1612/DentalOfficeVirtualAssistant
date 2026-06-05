# Dental Office Virtual Assistant

A comprehensive customer support chatbot solution for a dental office, built with Azure Bot Service, QnA Maker, LUIS, and deployed on Azure cloud platform.

![Project Architecture](docs/architecture-diagram.png)

## 🎯 Project Overview

This project creates an intelligent virtual assistant that lives on a dentist website. The bot can:
- Answer frequently asked questions using Azure QnA Maker
- Understand appointment scheduling intents using LUIS
- Help patients schedule appointments through a scheduling API
- Provide a conversational interface for patients

## 📁 Project Structure

```
DentalOfficeVirtualAssistant/
├── ContosoDentistryChatBot/       # Node.js bot application
│   ├── bot.js                      # Main bot logic
│   ├── index.js                    # Entry point
│   ├── package.json                # Dependencies
│   └── .env                        # Environment variables
├── ContosoDentistryScheduler/      # Scheduling API
│   ├── server.js                   # Express API server
│   └── package.json                # Dependencies
├── ContosoDentistryWebsite/        # Static website
│   ├── index.html                  # Main webpage
│   ├── styles.css                  # Styling
│   └── script.js                   # Client-side scripts
├── ContosoDentistryFAQs/           # QnA Maker data
│   └── FAQ.tsv                     # FAQ data file
├── .github/workflows/              # CI/CD workflows
│   ├── chatbot-deploy.yml          # Bot deployment
│   ├── scheduler-deploy.yml        # API deployment
│   └── website-deploy.yml          # Website deployment
└── docs/                           # Documentation
```

## 🚀 Quick Start

### Prerequisites

- [Visual Studio Code](https://code.visualstudio.com/download)
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [Bot Framework Emulator](https://github.com/Microsoft/BotFramework-Emulator/releases)
- [Azure Account](https://azure.microsoft.com/free/)
- [Git](https://git-scm.com/downloads)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/DentalOfficeVirtualAssistant.git
   cd DentalOfficeVirtualAssistant
   ```

2. **Set up the Chatbot**
   ```bash
   cd ContosoDentistryChatBot
   npm install
   # Configure .env file with your Azure credentials
   npm start
   ```

3. **Set up the Scheduler API**
   ```bash
   cd ../ContosoDentistryScheduler
   npm install
   npm start
   ```

4. **Test the Bot**
   - Open Bot Framework Emulator
   - Connect to `http://localhost:3978/api/messages`
   - Start chatting with your bot!

## 🔧 Configuration

### Environment Variables

Create a `.env` file in `ContosoDentistryChatBot/` with the following:

```env
MicrosoftAppId=your-bot-app-id
MicrosoftAppPassword=your-bot-app-password
PORT=3978

QnAKnowledgebaseId=your-qna-kb-id
QnAEndpointKey=your-qna-endpoint-key
QnAEndpointHostName=your-qna-hostname

LuisAppId=your-luis-app-id
LuisAPIKey=your-luis-api-key
LuisAPIHostName=your-luis-hostname

ContosoDentistrySchedulerAPI=https://your-scheduler-api-url
```

## ☁️ Azure Deployment

### Step 1: Create Azure Resources

1. **Azure Bot Service**
   - Create a Bot resource in Azure Portal
   - Note the App ID and Password

2. **QnA Maker**
   - Create QnA Maker resource
   - Import FAQ.tsv file
   - Train and publish the knowledge base

3. **LUIS (Language Understanding)**
   - Create LUIS resource
   - Create `GetAvailability` and `ScheduleAppointment` intents
   - Add example utterances and train the model

4. **App Services**
   - Create App Service for ChatBot
   - Create App Service for Scheduler API

5. **Static Web App**
   - Create Static Web App for the website

### Step 2: Configure GitHub Secrets

Add the following secrets to your GitHub repository:

- `AZURE_WEBAPP_PUBLISH_PROFILE_CHATBOT`
- `AZURE_WEBAPP_PUBLISH_PROFILE_SCHEDULER`
- `AZURE_STATIC_WEB_APPS_API_TOKEN`

### Step 3: Deploy

Push your code to GitHub, and GitHub Actions will automatically deploy:
```bash
git add .
git commit -m "Deploy to Azure"
git push origin main
```

## 🧪 Testing

### Test with Bot Framework Emulator

1. Start the bot locally: `npm start` in ContosoDentistryChatBot
2. Open Bot Framework Emulator
3. Connect to `http://localhost:3978/api/messages`
4. Test conversations:
   - "What appointments are available?"
   - "I don't have insurance. Can I still be seen?"
   - "Schedule an appointment"

### Test in Azure Portal

1. Navigate to your Bot resource in Azure Portal
2. Go to "Test in Web Chat"
3. Test the same conversations

## 📊 Features

### QnA Maker Integration
- Answers 20+ frequently asked questions
- Handles insurance, scheduling, and general inquiries
- Natural language understanding

### LUIS Integration
- Recognizes scheduling intents
- Extracts date/time entities
- Routes to appropriate handlers

### Scheduling API
- RESTful API for appointment management
- Available time slots
- Book and cancel appointments

### Professional Website
- Responsive design
- Modern UI/UX
- Integrated chatbot
- Contact information and testimonials

## 📝 Project Requirements Checklist

- [x] Bot application that can be modified and tested locally
- [x] QnA Maker trained to answer FAQs
- [x] LUIS trained to recognize scheduling intents
- [x] Bot code deployed to Azure
- [x] Bot deployed to static web app
- [x] GitHub Actions for automated deployment
- [x] Custom greeting message
- [x] Professional dentistry-themed website

## 🎨 Customization

### Add More FAQs
Edit `ContosoDentistryFAQs/FAQ.tsv` and reimport to QnA Maker

### Modify Bot Behavior
Edit `ContosoDentistryChatBot/bot.js` to add custom logic

### Update Website Design
Edit `ContosoDentistryWebsite/styles.css` for styling changes

## 📚 Documentation

- [Setup Guide](docs/SETUP.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [API Documentation](docs/API.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)

## 🤝 Contributing

This is a learning project. Feel free to fork and customize for your own needs!

## 📄 License

MIT License - See LICENSE file for details

## 👥 Author

Created as part of the Azure AI Developer Nanodegree program

## 🔗 Resources

- [Azure Bot Service Documentation](https://docs.microsoft.com/azure/bot-service/)
- [QnA Maker Documentation](https://docs.microsoft.com/azure/cognitive-services/qnamaker/)
- [LUIS Documentation](https://docs.microsoft.com/azure/cognitive-services/luis/)
- [Bot Framework SDK](https://github.com/Microsoft/botbuilder-js)

## 📸 Screenshots

Include screenshots of:
- Bot testing in emulator
- Azure portal bot test
- Live website with chatbot

---

**Note**: Remember to replace placeholder URLs and credentials with your actual Azure resource details.
