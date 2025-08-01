import { DefaultAzureCredential } from '@azure/identity';
import { AIProjectClient } from '@azure/ai-projects';
import { endpoint } from './config/env.js';
import { promptConfig } from './config/promptConfig.js';
import { processSelectedPrompt } from './services/agentService.js';
import { displayAvailablePrompts, getPromptSelection } from './utils/console.js';

async function main() {
    try {
        const client = new AIProjectClient(endpoint, new DefaultAzureCredential());

        let continueLoop = true;

        while (continueLoop) {
            displayAvailablePrompts(promptConfig);
    
            const selectedIndex = await getPromptSelection();
            const promptKeys = Object.keys(promptConfig);
    
            // Check if user wants to exit
            if (selectedIndex === promptKeys.length) {
                console.log('Exiting application.');
                process.exit(1);
            }
    
            if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= promptKeys.length) {
                console.error('Invalid selection. Please enter a number between 1 and ' + (promptKeys.length + 1));
                continue;
            }
    
            await processSelectedPrompt(client, promptKeys[selectedIndex]);
        }
    } catch (err) {
        console.error('The application encountered an error:', err);
    }
}

// Start the application
main().catch((err) => {
    console.error('The sample encountered an error:', err);
    process.exit(1);
});