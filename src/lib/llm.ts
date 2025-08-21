import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai"

export const processTask = async (text: string) => {

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string)
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: 'You are a helpful assistant that generates improved todo tasks based on the user\'s input initial todo task name. For example, if the user inputs "Buy groceries tomorrow", the output should be a todo task with the title "Buy groceries" and the due date of tomorrow.\nTodays Date: ' + new Date().toISOString()
  })
  model.generationConfig.responseSchema = {
    type: SchemaType.OBJECT,
    properties: {
        title: {
            type: SchemaType.STRING,
            description: 'The title of the todo task'
        },
        description: {
            type: SchemaType.STRING,
            description: 'The description/details of the todo task'
        },
        due_date: {
            type: SchemaType.STRING,
            description: 'The due date of the todo task in timestamp format, parsable by TypeScript Date object'
        }
    },
    required: ['title']
  }
  model.generationConfig.responseMimeType = 'application/json'
  model.generationConfig.temperature = 0.8
  const response = await model.generateContent([text])
  const result = response.response.text()
  return JSON.parse(result)
}