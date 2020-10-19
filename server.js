//use these to write the data to db.json
const fs = require('fs');
const path = require('path');

//all you need to run express
const express = require('express');
//use an enviornmental variable to tell our app to use that port
const PORT = process.env.PORT || 3001;
const app = express();

//add some middleware to parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
//middleware parse incoming JSON data
app.use(express.json());
//*both of these must be used every time you create a server that's looking to accept post data

//create a route that the front-end can request data from.
//start by requiring the data
const notes = require('../db/db.json');

app.get('/', (req, res) => {
  res.send(path.join(__dirname, 'index.html'));
});

//add the route (the get method requires 2 arguments (string describing route and callback function))
app.get('/notes', (req, res) => {
  res.send(path.join(__dirname, 'notes.html'));
  //use the send method from the res parameter to send the string
  }
});

// GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get('/api/notes', (req, res) => {
  return res.json(notes);
})

// POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).
app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = notes.length.toString();
  notes.push(newNote);
  fs.writeFileSync('../db/db.json', JSON.stringify)
  res.json(notes);
});




// at the bottom 
//replace harcoded value of 3001 with the PORT variable
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});