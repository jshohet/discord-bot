const OpenAI = require("openai");
const { Client, Message } = require("discord.js");

module.exports =  async(client, message) => {
  try {
    if (message.author.bot) return;
    if (message.channel.name !== "chat-gpt") return;
    if (message.content.startsWith("!")) return;

    const openai = new OpenAI({
      apiKey: process.env.API_KEY,
    });

    await message.channel.sendTyping();

    const sendTypingInterval = setInterval(()=>{
        message.channel.sendTyping();
    }, 5000);

    let conversation = [];
    conversation.push({
      role: "system",
      content: "You are a sarcastic chatbot.",
    });

    let prevMessages = await message.channel.messages.fetch({limit: 20});
    prevMessages.reverse();

    prevMessages.forEach((msg) =>{
        if(msg.author.bot && msg.author.id !== client.user.id) return;
        if(msg.content.startsWith('!')) return;

        const username = msg.author.username
          .replace(/\s+/g, "_")
          .replace(/[^\w\s]/gi, "");

          if(msg.author.id === client.user.id){
            conversation.push({
                role: 'assistant',
                name: username,
                content: msg.content
            })
            return;
          }

          conversation.push({
            role: 'user',
            name: username,
            content: msg.content,
          })          
    })

    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages:conversation
    }).catch((error) => console.error(`OpenAI error: ${error}`));

    clearInterval(sendTypingInterval);

    if(!response){
        message.reply("i'm having issues with the api, try again in a moment.");
        return;
    }

    const responseMessage = response.choices[0].message.content;
    const chunkSizeLimit = 2000;

    for(let i =0; i<responseMessage.length; i+= chunkSizeLimit){
        const chunk = responseMessage.substring(i, i+chunkSizeLimit);

        await message.reply(chunk);
    }
  } catch (error) {
    console.log(error)
  }
};
