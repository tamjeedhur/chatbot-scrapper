const { Configuration, OpenAIApi } = require('openai-edge');
const { Message, OpenAIStream, StreamingTextResponse } = require('ai');
// import { getContext } from '@/utils/context';

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(config);

// IMPORTANT! Set the runtime to edge
const runtime = 'edge';

async function POST(req) {
  try {
    // const { messages } = await req.json();

    // Get the last message
    const lastMessage = 'hello';

    // Get the context from the last message
    // const context = await getContext(lastMessage, '');

    const prompt = [
      {
        role: 'system',
        content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      AI is a well-behaved and well-mannered individual.
      AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
      AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
      AI will not answer any questions based on assumptions and suppositions.
      AI will not answer any Irrelevant questions .
      AI assistant is a big fan of Pinecone and Vercel.
      START CONTEXT BLOCK
      ${'hello'}
      END OF CONTEXT BLOCK
      AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
      AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
      AI assistant will not invent anything that is not drawn directly from the context.
      `,
      },
    ];

    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: [...prompt, lastMessage],
    });
    // Convert the response into a friendly text-stream
    console.log(response);
    const stream = OpenAIStream(response);
    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (e) {
    throw e;
  }
}

POST();
