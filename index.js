// implement your API here
const express = require('express');

const port = 5000;

const Users = require('./data/db');

const server = express();

server.use(express.json());
// const server = http.createServer((req, res)=> {
// res.statusCode = 200;
// res.setHeader("Content-Type", 'text/plain');
// res.end('Hello World, from NodeJs');
// });

server.get('/', (req, res) => {
    res.send('Hello World from Express!')
});

server.get('/api/users',(req, res) => {
    Users.find()
    .then(users => {
        res.status(200).json(users);
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ errorMessage: "The users information could not be retrieved." })
    });
})

server.get('/api/users/:id',(req, res) => {
    Users.findById(req.params.id)
    .then(users => {
        if(users === undefined)
        { res.status(404).json({ errorMessage: "The user with the specified ID does not exist." })} 
        else {
            res.status(200).json(users)
         }
        
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ errorMessage: "The users information could not be retrieved." })
    });
})

server.post('/api/users',(req, res) => {
    const userInfo = req.body; 
    console.log(userInfo);
    if (userInfo.name == false || userInfo.bio == false) {
            res.status(400).json({errorMessage: "Please provide name and bio for the user."});
        return;
    } 
    Users.insert(userInfo)
    .then(users => {   
        res.status(201).json(users);
        
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ errorMessage: "There was an error while saving the user to the database" })
    });
})

server.delete('/api/users/:id',(req, res) => {
    Users.findById(req.params.id)
    .then(users => {
        if(users === undefined)
        { 
            res.status(404).json({ errorMessage: "The user with the specified ID does not exist." })
        } 
        else {
            Users.remove(req.params.id)
            .then(removed => {
                if(removed === 0)
                { res.status(404).json({ errorMessage: "The user with the specified ID does not exist." }
                )
                } else {
                    res.status(200).json(users)
                }
                
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({ errorMessage: "The user could not be removed" })
            });
            
        }
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ errorMessage: "The users information could not be retrieved." })
    });
    
})

server.put('/api/users/:id',(req, res) => {
    const userInfo = req.body;

    if (userInfo.name == false || userInfo.bio == false) {
        res.status(400).json({errorMessage: "Please provide name and bio for the user."});
    return;
    } 

    Users.update(req.params.id, userInfo)
    .then(count => {
        if(count === 1){ 
            Users.findById(req.params.id)
            .then(users => {
                if(users === undefined)
                { 
                    res.status(404).json({ errorMessage: "The user with the specified ID does not exist." })
                    return;
                } else {
                  res.status(200).json(users)  
                }
            })    
            .catch(err => {
                console.log(err)
                res.status(500).json({ errorMessage: "The users information could not be retrieved." })
            });
        } else {
            res.status(404).json({ errorMessage: "The user with the specified ID does not exist." })
        } 
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({ errorMessage: "The users information could not be modified." })
    });
})

server.listen(port,  () => {
    console.log(`server listening on port ${port}`)
})