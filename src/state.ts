import { Annotation, MessagesAnnotation } from "@langchain/langgraph";

export const graphState = Annotation.Root({
    //stores message history(AI msg, User msg etc)
    ...MessagesAnnotation.spec,

})