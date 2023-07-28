const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send("bot is running....");
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
// replace the value below with the Telegram token you receive from @BotFather
const token = "6689491246:AAGjyRDlJrR1m4wSl4Biz9oj6J1akFBpMN4";

const bot = new TelegramBot(token, { polling: true });


// bot.on("message", (msg) => {
//   const chatId = msg.chat.id;
//   const userInput = msg.text;

//   if (userInput == "hi") {
//     bot.sendMessage(chatId, "hello");

//   } else {
//     bot.sendMessage(chatId, "i don't understand anything");
//   }

// })





bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userInput = msg.text;

  if (msg.photo) {
    // 'photo' is an array of photos sent, but we'll just take the last one (the highest resolution)
    const photo = msg.photo[msg.photo.length - 1];
    const fileId = photo.file_id;

    // Fetch the image using the file ID
    try {
      const fileDetails = await bot.getFile(fileId);
      bot.sendMessage(chatId, `You sent an image. Image`);
    } catch (error) {
      bot.sendMessage(chatId, "Failed to fetch the image.");
    }
  } else {

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&appid=ea05f0b6617d998492f421c4335d3bba`
      );
      const data = response.data;
      const weather = data.weather[0].description;
      const temperature = data.main.temp - 273.15;
      const city = data.name;
      const humidity = data.main.humidity;
      const pressure = data.main.pressure;
      const windSpeed = data.wind.speed;
      const message = `The weather in ${city} is ${weather} with a temperature of ${temperature.toFixed(2)}°C. The humidity is ${humidity}%, the pressure is ${pressure}hPa, and the wind speed is ${windSpeed}m/s.`;

      bot.sendMessage(chatId, message);
    } catch (error) {
      bot.sendMessage(chatId, "City doesn't exist.");
    }

  }

});
