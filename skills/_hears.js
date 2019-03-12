const axios = require('axios')
const {SECRET_API_KEY}=require(`../keys`)

module.exports = function(controller) {

  controller.hears(['hello','hi','yo','whats up','hey','how'],'message_received', function(bot, message) {
   
      let conversationIntent = message.intents[0].entities.intent[0].value

        if(conversationIntent==='greetings'){
          bot.reply(message,'Greetings, fleshy human');
        } else if(conversationIntent==='conversation'){
          bot.reply(message,'Beep boop beep. I am doing great.');
        }
  });

  //script for checking on keyword: weather  
  controller.hears('weather','message_received',function(bot, message) {
    
    //checks to see if there is a location in the message AND if the middleware can reasonably extract
    //a location from the message
    if(message.intents[0].entities.location && message.intents[0].entities.location[0].confidence>0.8){
      
      let city = message.intents[0].entities.location[0].value
      
      //second check to see if we can get a city value
      if(city){
      //axios call to the open weather API. Targets the secondary description. This can be changed.
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city},us&appid=${SECRET_API_KEY}`)
        .then(res=>{
          let weather = res.data.weather[0].description,
              temp = Math.round((((res.data.main.temp)-273.15)*9/5)+32)
      
          bot.reply(message,{
            text:`The weather in ${city} is ${weather}. It's about ${temp} degrees Fahrenheit.`,
            typing:true
          })
      //Wit.ai can parse for a location. However, it cannot validate if it is a real location. Below will 
      //have the bot respond with an error if no actual city is found.
        }).catch(error=>{
          bot.reply(message,{
            text:`Sorry, I couldn't find ${city} in my database. I only have U.S. cities.`,
            typing:true
          })
        })  
      } 
    //if no city location can be found, spit out the below message.
    } else{
      bot.reply(message,{
        text:`If you want to talk about the weather, I need a city.`,
        typing:true
      })
    }     
  });
}
