const express = require('express');
const amqp = require('amqplib');
const cors = require('cors');

const app = express();
const port = 3002;

app.use(cors());

let clickCount = 0;

(async () => {
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queue = 'click_queue';

        await channel.assertQueue(queue, {
            durable: false
        });

        console.log('Click tracking waiting for messages...');

        channel.consume(queue, function (msg) {
            if (msg.content.toString() === 'click') {
                clickCount++;
                console.log(`Click Count: ${clickCount}`);
            }
        }, { noAck: true });
    } catch (error) {
        console.error('An error occurred:', error);
    }
})();

app.get('/clickCount', (req, res) => {
    res.json({ clickCount });
});

app.listen(port, () => {
    console.log(`Click tracking listening at http://localhost:${port}`);
});
