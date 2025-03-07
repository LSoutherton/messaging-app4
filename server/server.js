require('dotenv').config();
const express = require('express');
const db = require('./db');
const cors = require('cors');

const app = express()

app.use(cors({origin: true}));
app.use(express.json());

const port = process.env.PORT || 3001;

//Get all users whos name starts with input
//Uses async function as we know that we will receieve a promise, this allows us to execute the further code whilst waiting for the promise to be executed.
//BY not including the parameter within the SQL, we avoid SQL injection.
app.get('/api/v1/:input', cors(), async (req, res) => {
    try {
        const results = await db.query("select * from users where username like $1",
        [
            `${req.params.input}%`
        ]
        )

        //We return the res (response) and include the data that we have just received as part of this.
        res.status(200).json({
            status: 'sucess',
            results: results.rows[0],
            data: {
                users: results.rows
            }
        })
        //Catches and logs the error if there is one.
    } catch (err) {
        console.log(err)
    }
})

// User is created and logged in
app.post('/api/v1/createUser',cors(), async (req, res) => {
    try {
        const results = await db.query(
            'INSERT INTO users (username, password) values ($1, $2) returning *',
            [
                req.body.username,
                req.body.password
            ]
        )

        res.status(200).json({
            status: 'sucess',
            data: {
                result: results.rows[0]
            }
        })
    } catch (err) {
        console.log(err)
    }
})

//Add message to database
app.post('/api/v1/sendMessage', async (req, res) => {
    try {
        const results = await db.query(
            'INSERT INTO messages (sender_id, receiver_id, message, date, date_calc, time, time_num) values ($1, $2, $3, $4, $5, $6, $7) returning *',
            [
                req.body.sender,
                req.body.receiver,
                req.body.message,
                req.body.date,
                req.body.date_calc,
                req.body.time,
                req.body.time_num
            ]
        )

        res.status(200).json({
            status: 'sucess',
            data: {
                result: results.rows[0]
            }
        })
    } catch (err) {
        console.log(err)
    }
})

//Get all messages for the current user
app.get('/api/v1/getMessages/:username', async (req, res) => {
    try {
        //Gets the messages sent by the current user
        const sent = await db.query('select * from messages where sender_id = $1',
        [
            req.params.username
        ])

        //Gets the messages received by the current user
        const received = await db.query('select * from messages where receiver_id = $1',
        [
            req.params.username
        ])

        //Creates a new object using the map method. Each message is added to the object along with the id of the receiver.
        const sentFiltered = [...new Map(sent.rows.map(message => [message.receiver_id, message])).values()]

        const receivedFiltered = [...new Map(received.rows.map(message => [message.sender_id, message])).values()]

        //Combines the 2 new objects to make one containing all messages
        const messages = sentFiltered.concat(receivedFiltered)

        //Creates an empty array
        let testingArray = [];

        //Sorts the array by time that each message was sent.
        //A negative return tells us that b is more recent, a positive tells us a is more recent.
        messages.sort((a, b) => {
            if (a.date === b.date) {
                if (a.time_num - b.time_num < 0) {
                    return 1
                } else {
                    return -1
                }
            } else if (a.date_calc < b.date_calc){
                return 1
            } else {
                return -1
            }
        })

        /*
        Each message will appear once in the sentFiltered list and again in the receivedFiltered list.
        We use the below code to identify these duplicates and add them to the testingArray.
        We check some of the parameters are the same then conclude that the messages are infact the same (this is not best practice).
        The message is then added to the testingArray.
        */

        const duplicatesArray = sentFiltered.forEach((sent) => {
            receivedFiltered.forEach((received) => {
                if (sent.sender_id === received.receiver_id && sent.receiver_id === received.sender_id) {
                    if (sent.date === received.date ) {
                        if (sent.time_num > received.time_num) {
                            testingArray.push(received)
                        } else {
                            testingArray.push(sent)
                        }
                    } else if (sent.date < received.date) {
                        testingArray.push(sent)
                    } else if (sent.date > received.date) {
                        testingArray.push(received)
                    }
                }
            })
        })

        //We look at each message in the testingArray and find the first instance of it in the messages list. 
        //Then splice is used to remove this instance of the message and results in there bein gno duplicate messages.
        testingArray.forEach((item) => {
            messages.forEach((message) => {
                if (item.id === message.id) {
                    const index = messages.indexOf(item)
                    if (index > -1) {
                        //Removes from messages array
                        messages.splice(index, 1);
                    }
                }
            })
        })

        //The messages list and the testingArray are then returned from the api call. Only the messages list is then used on the front end so testingArray can be removed after testing is complete.
        res.status(200).json({
            status: 'sucess',
            data: {
                messages,
                testingArray
            }
        })
    } catch (err) {
        console.log(err)
    }
})

//Get all messages for the current conversation
app.get('/api/v1/getConversation/:receiver/:user', async (req, res) => {
    try {
        const messages = await db.query('select * from messages where receiver_id = $2 and sender_id = $1 or receiver_id = $1 and sender_id = $2',
        [
            req.params.receiver,
            req.params.user
        ])

        res.status(200).json({
            status: 'sucess',
            data: {
                messages: messages.rows,
            }
        })
    } catch (err) {
        console.log(err)
    }
})

//Delete all messages for the example account
app.delete('/api/v1/delete/example', async (req, res) => {
    try {
        const results = db.query(
            "delete from messages where sender_id = 'Example' or receiver_id = 'Example';"
        )

        res.status(200).json({
            status: 'sucess',
        })
    } catch (err) {
        console.log(err)
    }
})

//This will help to see if everything is working correctly as it will trigger on startup.
app.listen(port, () => {
    console.log(`listening on port ${port}`)
});