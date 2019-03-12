const axios = require('axios')

let SECRET_API_KEY=`2c83d0901c37cc202a8f1afd54f7e378`

module.exports = function(controller) {

  controller.on('hello', conductOnboarding);
  controller.on('welcome_back', conductOnboarding);

  function conductOnboarding(bot, message) {

    bot.startConversation(message, function(err, convo) {

      convo.say({
        text: 'Hello human! I am brand new Botkit bot, ready to be customized to your needs!',
        quick_replies: [
          {
            title: 'Help',
            payload: 'help',
          },
        ]
      });


    });

  }
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
