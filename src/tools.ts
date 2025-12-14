import { TavilySearch } from "@langchain/tavily";
import type { graphState, QuestionAnswer } from "./state";
import { HumanMessage, type AIMessage } from "@langchain/core/messages";

const tavilySearch = new TavilySearch({ maxResults: 2 }); //get max 2 website results
export async function searchExecutor(state: typeof graphState.State) {
    // Get the last message from the state(which is LLM message containing search queries)
    const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
    // Parse the content to extract search queries as QuestionAnswer type(having answer, reflection, searchQueries)
    const parsed = JSON.parse(lastMessage.content as string) as QuestionAnswer;
    // Execute batch search(parallel tavily search call) using the extracted search queries
    const searchResult = await tavilySearch.batch(parsed.searchQueries.map((query) => ({ query }))); //returns [{}, {}]

    const cleanedResults = [];

    for (let i = 0; i < parsed.searchQueries.length; i++) {
        const query = parsed.searchQueries[i];
        const searchOutput = searchResult[i];

        // Access the results array directly from the search output
        const results = searchOutput?.results || [];

        // Extract only essential fields from each result
        for (const result of results) {
            cleanedResults.push({
                query: query,
                content: result.content || '',
                url: result.url || '',
            });
        }
    }
    //store the tavily search results back into the state as a HumanMessage
    return {
        messages: [new HumanMessage(JSON.stringify({ searchResults: cleanedResults }))],
    };
}