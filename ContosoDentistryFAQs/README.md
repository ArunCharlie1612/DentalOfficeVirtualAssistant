# Contoso Dentistry FAQs

This folder contains FAQ data for the QnA Maker knowledge base.

## Files

- **FAQ.tsv** - Tab-separated values file containing questions and answers for the dental office

## Usage

1. Navigate to the [QnA Maker portal](https://www.qnamaker.ai/)
2. Create a new knowledge base
3. Import the FAQ.tsv file
4. Train and publish the knowledge base
5. Connect the knowledge base to your bot using the credentials in the .env file

## FAQ Categories

The FAQ file includes questions about:
- Insurance and payment options
- Office hours and location
- Appointment scheduling
- Services offered
- Emergency care
- Dental anxiety and sedation
- First visit information
- Technology and equipment

## Format

The TSV file uses the following columns:
- **Question** - The question patients ask
- **Answer** - The response provided by the chatbot
- **Source** - Editorial (manually created)
- **Metadata** - Additional tags (optional)
