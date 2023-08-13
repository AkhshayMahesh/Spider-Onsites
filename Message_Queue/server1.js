const express = require('express');
const amqp = require('amqplib');
const cors = require("cors")

const app = express();
const port = 3001;

app.use(cors())

app.get('/click', async (req, res) => {
    console.log("handling click");
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queue = 'click_queue';

        await channel.assertQueue(queue, {
            durable: false
        });

        channel.sendToQueue(queue, Buffer.from('click'));
        console.log(" You sent a %s", 'click');

        setTimeout(async () => {
            await channel.close();
            await connection.close();
            res.send('Click recorded!');
        }, 500);
    } catch (error) {
        console.error('An error occurred:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`REST endpoint service listening at http://localhost:${port}`);
});
