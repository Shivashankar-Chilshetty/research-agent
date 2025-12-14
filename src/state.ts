import { Annotation, MessagesAnnotation } from "@langchain/langgraph";
import z from 'zod';

//critique schema
const reflectionSchema = z.object({
    missing: z.string().describe('Critique of what is missing.'), //what is lacking
    superfluous: z.string().describe('Critique of what is superfluous'), //what is unnecessary
});

export const questionAnswerSchema = z.object({
    answer: z.string().describe('~250 word detailed answer to the question.'),
    reflection: reflectionSchema,
    searchQueries: z
        .array(z.string())
        .describe(
            '1-3 search queries for researching improvements to address the critique of your current answer.'
        ),
});

//exporting the inferred TypeScript type
export type QuestionAnswer = z.infer<typeof questionAnswerSchema>;

export const graphState = Annotation.Root({
    //stores message history(AI msg, User msg etc)
    ...MessagesAnnotation.spec,
    iteration: Annotation<number>, //to track the number of iterations
})