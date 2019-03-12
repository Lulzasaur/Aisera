const axios = require('axios')
var SECRET_WIT_TOKEN = `2D3TAPROJV2MSMZ6IHMEUKGDYYDENUSV`

var wit = require('botkit-middleware-witai')({
  token: SECRET_WIT_TOKEN
})

module.exports = function(controller) {


  controller.hears('test','message_received', function(bot, message) {
    console.log('test')
    bot.reply(message,'I heard a test');

  });

  controller.hears('typing','message_received', function(bot, message) {

    bot.reply(message,{
      text: 'This message used the automatic typing delay',
      typing: true,
    }, function() {

      bot.reply(message,{
        text: 'This message specified a 5000ms typing delay',
        typingDelay: 5000,
      });

    });

  });

  controller.hears('weather','message_received',function(bot, message) {
    
    let SECRET_API_KEY=`2c83d0901c37cc202a8f1afd54f7e378`,
        city = message.intents[0].entities.location[0].value

    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city},us&appid=${SECRET_API_KEY}`)
    .then(function(res){
      let weather = res.data.weather[0].description
      bot.reply(message,{
        text:`The weather in ${city} is ${weather}`,
        typing:true
      })
      // console.log(res.data.weather[0].main)
  
    })
        
  });
  

}
