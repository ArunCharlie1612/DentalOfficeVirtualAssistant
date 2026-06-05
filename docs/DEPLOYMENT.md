# Deployment Guide

This guide covers deploying the Dental Office Virtual Assistant to Azure using GitHub Actions.

## Table of Contents

1. [Deployment Overview](#deployment-overview)
2. [GitHub Setup](#github-setup)
3. [Azure Deployment Configuration](#azure-deployment-configuration)
4. [Deploy ChatBot](#deploy-chatbot)
5. [Deploy Scheduler API](#deploy-scheduler-api)
6. [Deploy Website](#deploy-website)
7. [Verification](#verification)

## Deployment Overview

The project uses GitHub Actions for CI/CD with three separate workflows:
- `chatbot-deploy.yml` - Deploys bot to Azure App Service
- `scheduler-deploy.yml` - Deploys API to Azure App Service
- `website-deploy.yml` - Deploys website to Azure Static Web Apps

## GitHub Setup

### 1. Create GitHub Repository

```bash
# Initialize git if not already done
cd DentalOfficeVirtualAssistant
git init

# Add files
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR-USERNAME/DentalOfficeVirtualAssistant.git
git branch -M main
git push -u origin main
```

### 2. Configure Repository Secrets

GitHub Actions needs access to Azure. Add these secrets to your repository:

1. Go to your GitHub repository
2. Click "Settings" → "Secrets and variables" → "Actions"
3. Click "New repository secret"

Add the following secrets:

#### For ChatBot App Service

**Secret Name**: `AZURE_WEBAPP_PUBLISH_PROFILE_CHATBOT`

**How to get the value**:
1. Go to Azure Portal
2. Navigate to your ChatBot App Service
3. Click "Get publish profile" in the Overview
4. Download the .PublishSettings file
5. Open it in a text editor
6. Copy the entire contents
7. Paste as the secret value

#### For Scheduler App Service

**Secret Name**: `AZURE_WEBAPP_PUBLISH_PROFILE_SCHEDULER`

Repeat the same process for the Scheduler API App Service.

#### For Static Web App

**Secret Name**: `AZURE_STATIC_WEB_APPS_API_TOKEN`

**How to get the value**:
1. Create Static Web App (see below)
2. Go to the Static Web App in Azure Portal
3. Click "Overview"
4. Copy the "Deployment token"
5. Paste as the secret value

## Azure Deployment Configuration

### 1. Deploy Scheduler API First

The scheduler API must be deployed first since the bot depends on it.

#### Update Workflow Configuration

Edit `.github/workflows/scheduler-deploy.yml`:

```yaml
env:
  AZURE_WEBAPP_NAME: contoso-dentistry-scheduler  # Change to your App Service name
  NODE_VERSION: '18.x'
```

#### Deploy

```bash
git add .github/workflows/scheduler-deploy.yml
git commit -m "Configure scheduler deployment"
git push origin main
```

#### Verify Deployment

1. Go to GitHub repository → "Actions" tab
2. Watch the "Deploy Scheduler API to Azure App Service" workflow
3. Once complete, verify the API is running:
   ```
   https://contoso-dentistry-scheduler.azurewebsites.net/
   ```

You should see:
```json
{
  "message": "Contoso Dentistry Scheduler API",
  "version": "1.0.0",
  "status": "running"
}
```

### 2. Deploy ChatBot

#### Update Bot App Service Configuration

1. Go to your ChatBot App Service in Azure Portal
2. Navigate to "Configuration" → "Application settings"
3. Add/update these settings:

```
MicrosoftAppId=<your-bot-app-id>
MicrosoftAppPassword=<your-bot-app-password>
QnAKnowledgebaseId=<your-qna-kb-id>
QnAEndpointKey=<your-qna-endpoint-key>
QnAEndpointHostName=<your-qna-hostname>
LuisAppId=<your-luis-app-id>
LuisAPIKey=<your-luis-api-key>
LuisAPIHostName=<your-luis-hostname>
ContosoDentistrySchedulerAPI=https://contoso-dentistry-scheduler.azurewebsites.net
```

4. Click "Save"

#### Update Workflow Configuration

Edit `.github/workflows/chatbot-deploy.yml`:

```yaml
env:
  AZURE_WEBAPP_NAME: contoso-dentistry-chatbot  # Change to your App Service name
  NODE_VERSION: '18.x'
```

#### Deploy

```bash
git add .github/workflows/chatbot-deploy.yml
git commit -m "Configure chatbot deployment"
git push origin main
```

#### Verify Deployment

1. Go to GitHub repository → "Actions" tab
2. Watch the workflow complete
3. Test in Azure Portal:
   - Go to your Bot resource
   - Click "Test in Web Chat"
   - Try: "What appointments are available?"
   - Try: "I don't have insurance. Can I still be seen?"

**Take a screenshot of this test and save as `portal_bot_test.png`** (required for project submission)

### 3. Deploy Website with Static Web App

#### Create Static Web App

1. In Azure Portal, click "Create a resource"
2. Search for "Static Web App"
3. Click "Create"
4. Configure:
   - **Name**: `contoso-dentistry-website`
   - **Plan type**: Free
   - **Region**: Choose closest to you
   - **Source**: GitHub
   - **GitHub account**: Connect your account
   - **Organization**: Your username
   - **Repository**: DentalOfficeVirtualAssistant
   - **Branch**: main
   - **Build Presets**: Custom
   - **App location**: `/ContosoDentistryWebsite`
   - **API location**: (leave empty)
   - **Output location**: (leave empty)
5. Click "Review + create" then "Create"

The deployment will start automatically and create the workflow file.

#### Get Web Chat Code from Bot

1. Go to your Bot resource in Azure Portal
2. Navigate to "Channels"
3. Click "Web Chat" channel
4. Copy the embedded HTML code shown

It will look like:
```html
<iframe src='https://webchat.botframework.com/embed/YOUR-BOT?s=YOUR-SECRET'></iframe>
```

Or for the script version:
```html
<!DOCTYPE html>
<html>
<body>
  <div id="webchat" role="main"></div>
  <script src="https://cdn.botframework.com/botframework-webchat/latest/webchat.js"></script>
  <script>
    window.WebChat.renderWebChat(
      {
        directLine: window.WebChat.createDirectLine({
          token: 'YOUR-DIRECTLINE-TOKEN'
        }),
        userID: 'USER_ID'
      },
      document.getElementById('webchat')
    );
  </script>
</body>
</html>
```

#### Update Website with Bot Code

1. Open `ContosoDentistryWebsite/index.html`
2. Find the comment: `<!-- TODO: Paste Web Chat code from Azure Bot Service here -->`
3. Replace the placeholder `<div id="bot-placeholder">` section with the Web Chat code:

```html
<div class="chat-container">
  <div id="webchat" role="main"></div>
</div>

<script src="https://cdn.botframework.com/botframework-webchat/latest/webchat.js"></script>
<script>
  window.WebChat.renderWebChat(
    {
      directLine: window.WebChat.createDirectLine({
        token: 'YOUR-DIRECTLINE-TOKEN'  // Replace with your token
      }),
      userID: 'USER_ID',
      username: 'Web Chat User',
      locale: 'en-US',
      styleOptions: {
        bubbleBackground: '#2196F3',
        bubbleFromUserBackground: '#764ba2',
        botAvatarBackgroundColor: '#2196F3',
        userAvatarBackgroundColor: '#764ba2'
      }
    },
    document.getElementById('webchat')
  );
</script>
```

4. Add CSS for proper sizing in `styles.css`:

```css
#webchat {
    height: 500px;
    width: 100%;
    border: none;
}
```

#### Deploy Website

```bash
git add ContosoDentistryWebsite/
git commit -m "Add Web Chat integration"
git push origin main
```

#### Verify Website Deployment

1. Go to GitHub repository → "Actions" tab
2. Watch the Static Web App deployment complete
3. Go to Static Web App in Azure Portal
4. Click "Overview" → "URL"
5. Visit the URL
6. Scroll to "Let's Chat!" section
7. Test the chatbot:
   - "What are your office hours?"
   - "What appointments are available?"

**Take a screenshot of the working chatbot on the website and save as `website_bot_test.png`** (required for project submission)

## Continuous Deployment

Once set up, deployments happen automatically:

- **ChatBot**: Push changes to `ContosoDentistryChatBot/` triggers deployment
- **Scheduler**: Push changes to `ContosoDentistryScheduler/` triggers deployment
- **Website**: Push changes to `ContosoDentistryWebsite/` triggers deployment

Example:
```bash
# Make changes to bot
vim ContosoDentistryChatBot/bot.js

# Commit and push
git add ContosoDentistryChatBot/bot.js
git commit -m "Update bot greeting message"
git push origin main

# GitHub Actions automatically deploys to Azure
```

## Verification Checklist

- [ ] Scheduler API is running and returns JSON response
- [ ] ChatBot App Service is running
- [ ] Bot responds in Azure Portal "Test in Web Chat"
- [ ] Static Web App is accessible via URL
- [ ] Web Chat widget appears on website
- [ ] Bot responds to questions on website
- [ ] QnA Maker answers FAQ questions
- [ ] LUIS recognizes scheduling intents
- [ ] GitHub Actions workflows are green
- [ ] Screenshots captured for submission

## Required Screenshots for Submission

1. **portal_bot_test.png** - Bot responding in Azure Portal "Test in Web Chat"
   - Must show a question like "What appointments are available?"
   - Must show bot response with available times

2. **website_bot_test.png** - Bot working on the deployed website
   - Must show the full website with chat interface
   - Must show a conversation with the bot

## Troubleshooting

### Deployment Fails

1. Check GitHub Actions logs for errors
2. Verify Azure resource names match workflow files
3. Ensure publish profiles/tokens are correct

### Bot Not Responding in Azure

1. Check App Service logs in Azure Portal
2. Verify environment variables are set
3. Ensure QnA Maker and LUIS are published
4. Check Bot messaging endpoint configuration

### Web Chat Not Showing

1. Verify Direct Line channel is enabled
2. Check browser console for errors
3. Ensure Web Chat code is correct
4. Verify bot is running and responding

### Static Web App Build Fails

1. Check build logs in GitHub Actions
2. Verify app_location path is correct
3. Ensure no build errors in HTML/CSS/JS

## Rollback

To rollback a deployment:

1. Go to App Service in Azure Portal
2. Navigate to "Deployment Center"
3. Click "Logs"
4. Find previous successful deployment
5. Click "Redeploy"

Or use GitHub:
```bash
git revert <commit-hash>
git push origin main
```

## Production Considerations

For a production deployment:

1. **Use Production Tiers**
   - App Services: B1 or higher
   - Static Web Apps: Standard
   - QnA Maker: S0
   - LUIS: S0

2. **Enable Application Insights**
   - Monitor bot performance
   - Track user conversations
   - Debug errors

3. **Add Custom Domain**
   - Configure SSL certificate
   - Use Azure DNS or custom domain

4. **Implement Security**
   - Enable CORS policies
   - Add authentication
   - Secure API endpoints

5. **Add Monitoring**
   - Set up alerts for failures
   - Monitor response times
   - Track API usage

## Next Steps

- Configure custom domain
- Add Application Insights
- Implement user authentication
- Add more conversation flows
- Enhance LUIS model

## Support

For deployment issues:
- Check [Troubleshooting Guide](TROUBLESHOOTING.md)
- Review Azure documentation
- Check GitHub Actions logs
