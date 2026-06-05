# Quick Start Guide

Get up and running in 15 minutes!

## 1. Install Prerequisites (5 minutes)

```bash
# Check if Node.js is installed
node --version  # Should be v18+

# If not installed, download from:
# https://nodejs.org/
```

Download Bot Framework Emulator:
https://github.com/Microsoft/BotFramework-Emulator/releases

## 2. Set Up Locally (5 minutes)

```bash
# Clone the repository
cd DentalOfficeVirtualAssistant

# Install ChatBot dependencies
cd ContosoDentistryChatBot
npm install

# Install Scheduler API dependencies
cd ../ContosoDentistryScheduler
npm install
```

## 3. Test Locally (5 minutes)

**Terminal 1 - Start Scheduler API:**
```bash
cd ContosoDentistryScheduler
npm start
```
Should show: `Contoso Dentistry Scheduler API is running on port 3000`

**Terminal 2 - Start ChatBot:**
```bash
cd ContosoDentistryChatBot
npm start
```
Should show: `restify listening to http://[::]:3978`

**Test with Bot Framework Emulator:**
1. Open Bot Framework Emulator
2. Click "Open Bot"
3. Enter: `http://localhost:3978/api/messages`
4. Click "Connect"
5. Type: "Hello"

✅ You should see the welcome message!

## Testing Without Azure Services

For initial testing without Azure setup:

1. The bot will show error messages about QnA/LUIS not configured
2. This is expected and OK for local testing
3. You can still see the bot structure and welcome message

## Next Steps

To enable full functionality:

1. **Create Azure Account** (Free tier available)
   - https://azure.microsoft.com/free/

2. **Follow Detailed Setup** 
   - See [docs/SETUP.md](docs/SETUP.md)
   - Create QnA Maker resource
   - Create LUIS resource
   - Configure .env file

3. **Deploy to Azure**
   - See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
   - Push to GitHub
   - Configure GitHub Actions
   - Deploy automatically

## Common Commands

```bash
# Start Scheduler API
cd ContosoDentistryScheduler && npm start

# Start ChatBot
cd ContosoDentistryChatBot && npm start

# Test Scheduler API
curl http://localhost:3000/api/availability

# Install dependencies
npm install

# Check for errors
npm list
```

## Troubleshooting

**Port already in use?**
```bash
# Mac/Linux
lsof -ti:3978 | xargs kill -9

# Windows
netstat -ano | findstr :3978
taskkill /PID <PID> /F
```

**Module not found?**
```bash
rm -rf node_modules package-lock.json
npm install
```

## File Structure Quick Reference

```
DentalOfficeVirtualAssistant/
├── ContosoDentistryChatBot/      # The bot (Port 3978)
├── ContosoDentistryScheduler/    # The API (Port 3000)  
├── ContosoDentistryWebsite/      # The website (HTML/CSS/JS)
├── ContosoDentistryFAQs/         # FAQ data for QnA Maker
├── .github/workflows/            # CI/CD automation
└── docs/                         # Full documentation
```

## Get Help

- [Setup Guide](docs/SETUP.md) - Complete Azure setup
- [Deployment Guide](docs/DEPLOYMENT.md) - Deploy to cloud
- [Troubleshooting](docs/TROUBLESHOOTING.md) - Fix issues
- [API Docs](docs/API.md) - API reference

---

**Ready to deploy to Azure?** See [docs/SETUP.md](docs/SETUP.md) for the full guide!
