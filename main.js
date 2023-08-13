/*
Create by Kurama
Github : https://github/Kurama250
Alert directory scan v1
*/

const fs = require('fs');
const Tail = require('tail').Tail;
const axios = require('axios');

const logFilePath = '/var/log/nginx/access.log';
const config = require('./config.json');

const tail = new Tail(logFilePath);

tail.on('line', (line) => {
  for (const file of config.sensitiveFiles) {
    if (line.includes(file)) {
      console.log(`Suspicious scan detected ! : ${line}`);
      sendRandomColorAlert(`Suspicious scan detected ! : ${line}`);
      break;
    }
  }
});

tail.on('error', (error) => {
  console.error('Error while tailing the log file:', error);
});

async function sendRandomColorAlert(message) {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);

  const embed = {
    title: 'Alert scan directory !',
    description: message,
    color: parseInt(randomColor, 16),
    timestamp: new Date().toISOString()
  };

  try {
    await axios.post(config.discordWebhookURL, {
      embeds: [embed]
    });

    console.log('Alert sent successfully.');
  } catch (error) {
    console.error('Error sending alert:', error);
  }
}