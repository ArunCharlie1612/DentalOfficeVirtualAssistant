# Troubleshooting Guide

Common issues and solutions for the Dental Office Virtual Assistant project.

## Table of Contents

1. [Bot Not Responding](#bot-not-responding)
2. [QnA Maker Issues](#qna-maker-issues)
3. [LUIS Issues](#luis-issues)
4. [Deployment Issues](#deployment-issues)
5. [Web Chat Issues](#web-chat-issues)
6. [API Issues](#api-issues)
7. [Local Development Issues](#local-development-issues)

---

## Bot Not Responding

### Issue: Bot doesn't respond in Bot Framework Emulator

**Symptoms:**
- No response after sending messages
- Connection error in emulator

**Solutions:**

1. **Check if bot is running**
   ```bash
   cd ContosoDentistryChatBot
   npm start
   ```
   Should show: `restify listening to http://[::]:3978`

2. **Verify endpoint URL in emulator**
   - Should be: `http://localhost:3978/api/messages`
   - NOT `https://` for local testing

3. **Check .env configuration**
   - For local testing, App ID and Password can be empty
   - Verify other credentials are correct

4. **Check console for errors**
   - Look for red error messages
   - Common: "Cannot find module" → Run `npm install`

5. **Restart the bot**
   - Stop with Ctrl+C
   - Run `npm start` again

---

### Issue: Bot responds to some questions but not others

**Symptoms:**
- FAQ questions work but scheduling doesn't
- Or vice versa

**Solutions:**

1. **Check which service is failing**
   - If FAQs don't work → QnA Maker issue
   - If scheduling doesn't work → LUIS or Scheduler API issue

2. **Test individual services**
   ```bash
   # Test Scheduler API
   curl http://localhost:3000/api/availability
   ```

3. **Check confidence scores**
   - QnA threshold is 0.5 in bot.js
   - LUIS threshold is 0.6 in bot.js
   - Lower these for testing:
   ```javascript
   if (qnaResults[0].score > 0.3) { // Lower threshold
   ```

---

## QnA Maker Issues

### Issue: QnA Maker not answering questions

**Symptoms:**
- Bot says "I'm not sure I understand" for FAQ questions
- QnA should answer but doesn't

**Solutions:**

1. **Verify QnA Maker is published**
   - Go to https://www.qnamaker.ai/
   - Open your knowledge base
   - Click "Publish"
   - If it says "Already published", it's good

2. **Check credentials in .env**
   ```env
   QnAKnowledgebaseId=abc123...
   QnAEndpointKey=xyz456...
   QnAEndpointHostName=https://your-qna.azurewebsites.net/qnamaker
   ```
   - KB ID should be a GUID
   - Endpoint Key should be long string
   - Hostname should include `/qnamaker` at end

3. **Test QnA Maker directly**
   - Go to QnA Maker portal
   - Click "Test"
   - Try your question
   - If it doesn't work there, retrain:
     - Click "Save and train"
     - Wait for completion
     - Test again

4. **Check question variations**
   - QnA Maker matches similar questions
   - Try exact question from FAQ.tsv first
   - Example: "I don't have insurance. Can I still be seen?"

5. **Verify FAQ import**
   - Check if all 20 Q&A pairs are in knowledge base
   - If missing, reimport FAQ.tsv

---

### Issue: "Could not connect to QnA Maker" error

**Solutions:**

1. **Check endpoint hostname format**
   - Should be: `https://your-name.azurewebsites.net/qnamaker`
   - Should NOT have `/knowledgebases/` in hostname
   - Should NOT have KB ID in hostname

2. **Verify endpoint key**
   - Get from QnA Maker portal after publishing
   - Or from Azure Portal → QnA Maker resource → Keys

3. **Check Azure resource is running**
   - Go to Azure Portal
   - Find QnA Maker App Service
   - Ensure it's running (not stopped)

---

## LUIS Issues

### Issue: LUIS not recognizing intents

**Symptoms:**
- "What appointments are available?" doesn't trigger scheduling
- LUIS intents show as "None"

**Solutions:**

1. **Verify LUIS is trained and published**
   - Go to https://www.luis.ai/
   - Open your app
   - Click "Train" (top right)
   - Click "Publish" → "Production slot"

2. **Check credentials in .env**
   ```env
   LuisAppId=12345678-1234-1234-1234-123456789012
   LuisAPIKey=abc123...
   LuisAPIHostName=westus.api.cognitive.microsoft.com
   ```
   - App ID should be a GUID
   - API Key from Azure Portal → LUIS resource → Keys
   - Hostname should NOT include `https://`

3. **Test LUIS directly**
   - In LUIS portal, click "Test"
   - Type: "What appointments are available?"
   - Should show GetAvailability as top intent
   - If not, add more example utterances

4. **Check intent confidence threshold**
   - In bot.js, LUIS threshold is 0.6
   - For testing, lower to 0.3:
   ```javascript
   if (luisResult.intents[topIntent]?.score > 0.3) {
   ```

5. **Add more training examples**
   - LUIS needs diverse examples
   - Add at least 10-15 utterances per intent
   - Include variations:
     - "Show me available times"
     - "When can I come in?"
     - "Do you have any openings?"

---

### Issue: LUIS recognizes intent but doesn't extract datetime

**Solutions:**

1. **Use prebuilt datetime entity**
   - In LUIS portal, go to "Entities"
   - Add "datetimeV2" prebuilt entity
   - Label datetime in utterances

2. **Label entities in examples**
   - Highlight "Monday" in utterance
   - Select "datetimeV2"
   - Train and publish again

---

## Deployment Issues

### Issue: GitHub Actions deployment fails

**Symptoms:**
- Red X on GitHub Actions workflow
- Deployment doesn't complete

**Solutions:**

1. **Check workflow logs**
   - Go to GitHub repository → Actions
   - Click failed workflow
   - Read error messages

2. **Verify secrets are set**
   - GitHub repo → Settings → Secrets
   - Should have:
     - `AZURE_WEBAPP_PUBLISH_PROFILE_CHATBOT`
     - `AZURE_WEBAPP_PUBLISH_PROFILE_SCHEDULER`
     - `AZURE_STATIC_WEB_APPS_API_TOKEN`

3. **Check publish profile format**
   - Should be entire XML content
   - No extra spaces or newlines
   - Download fresh from Azure if needed

4. **Verify Azure resource names**
   - Check workflow .yml files
   - App name must match Azure App Service name

5. **Check Node.js version**
   - Workflows use Node 18.x
   - Ensure Azure App Service also uses Node 18

---

### Issue: Deployment succeeds but bot doesn't work in Azure

**Solutions:**

1. **Check Application Settings**
   - Azure Portal → App Service → Configuration
   - Verify all environment variables are set
   - Save after adding/changing

2. **Check App Service logs**
   - Azure Portal → App Service → Log stream
   - Look for errors when bot starts

3. **Verify messaging endpoint**
   - Azure Portal → Bot resource → Configuration
   - Should be: `https://your-app-service.azurewebsites.net/api/messages`
   - Click "Apply" to save

4. **Restart App Service**
   - Azure Portal → App Service → Overview
   - Click "Restart"
   - Wait 30 seconds

---

## Web Chat Issues

### Issue: Web Chat doesn't appear on website

**Symptoms:**
- Only placeholder shows
- No chat widget

**Solutions:**

1. **Check if Web Chat code is added**
   - Open ContosoDentistryWebsite/index.html
   - Search for "WebChat.renderWebChat"
   - Should see Web Chat script

2. **Verify Direct Line secret**
   - Azure Portal → Bot resource → Channels
   - Click "Web Chat"
   - Copy secret key
   - Use in Web Chat code

3. **Check browser console**
   - Open browser DevTools (F12)
   - Look for errors
   - Common: "Failed to fetch" → Check bot is running

4. **Test with default Web Chat**
   - Azure Portal → Bot → "Test in Web Chat"
   - If it works there, issue is with embedding

---

### Issue: Web Chat shows but bot doesn't respond

**Solutions:**

1. **Check bot is deployed**
   - Verify App Service is running
   - Test in Azure Portal first

2. **Check Direct Line channel**
   - Azure Portal → Bot → Channels
   - Ensure "Web Chat" is enabled

3. **Regenerate Direct Line secret**
   - Azure Portal → Bot → Channels → Web Chat
   - Generate new secret
   - Update website code

---

## API Issues

### Issue: Scheduler API returns 404

**Solutions:**

1. **Check API is running**
   ```bash
   cd ContosoDentistryScheduler
   npm start
   ```

2. **Verify endpoint URL**
   - Local: `http://localhost:3000`
   - Azure: `https://your-scheduler-api.azurewebsites.net`

3. **Check API paths**
   - Endpoints start with `/api/`
   - Example: `/api/availability`

4. **Test with curl**
   ```bash
   curl http://localhost:3000/api/availability
   ```

---

### Issue: Bot can't connect to Scheduler API

**Solutions:**

1. **Check ContosoDentistrySchedulerAPI variable**
   - In .env: `ContosoDentistrySchedulerAPI=http://localhost:3000`
   - In Azure: Use full https URL

2. **Check CORS**
   - API allows all origins by default
   - If restricted, add bot's origin

3. **Check API is deployed**
   - Visit API URL in browser
   - Should show JSON response

---

## Local Development Issues

### Issue: npm install fails

**Solutions:**

1. **Check Node.js version**
   ```bash
   node --version
   ```
   Should be v18 or higher

2. **Clear npm cache**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Try with different registry**
   ```bash
   npm install --registry=https://registry.npmjs.org/
   ```

---

### Issue: Port already in use

**Symptoms:**
- Error: "EADDRINUSE: address already in use :::3978"

**Solutions:**

1. **Find and kill process**
   ```bash
   # Mac/Linux
   lsof -ti:3978 | xargs kill -9
   
   # Windows
   netstat -ano | findstr :3978
   taskkill /PID <PID> /F
   ```

2. **Change port**
   - Edit .env: `PORT=3979`
   - Update emulator endpoint

---

### Issue: Module not found errors

**Solutions:**

1. **Install missing dependency**
   ```bash
   npm install <module-name>
   ```

2. **Reinstall all dependencies**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

---

## Performance Issues

### Issue: Bot responds slowly

**Solutions:**

1. **Check API response times**
   - QnA Maker typically < 1s
   - LUIS typically < 500ms
   - Scheduler API typically < 100ms

2. **Add logging to measure**
   ```javascript
   console.time('QnA');
   const qnaResults = await this.qnaMaker.getAnswers(context);
   console.timeEnd('QnA');
   ```

3. **Check Azure tier**
   - Free tier has limitations
   - Upgrade to Standard for production

---

## Getting Help

If issues persist:

1. **Check Azure Status**
   - https://status.azure.com/
   - Verify services are operational

2. **Review Documentation**
   - [Setup Guide](SETUP.md)
   - [Deployment Guide](DEPLOYMENT.md)
   - [API Documentation](API.md)

3. **Enable Detailed Logging**
   ```javascript
   console.log('Debug info:', variableName);
   ```

4. **Test Components Separately**
   - Test QnA Maker in portal
   - Test LUIS in portal
   - Test API with curl
   - Then test bot integration

5. **Common Error Messages**
   - "401 Unauthorized" → Check credentials
   - "404 Not Found" → Check endpoint URL
   - "500 Internal Server Error" → Check logs
   - "CORS error" → Check CORS configuration

---

## Still Having Issues?

- Review [setup steps](SETUP.md) carefully
- Compare with working examples
- Check Azure documentation
- Ask for help on GitHub Issues
