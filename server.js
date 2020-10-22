//use these to write the data to db.json
const fs = require('fs');
const path = require('path');
const util = require('util');
var customId =require('custom-id')

//all you need to run express
const express = require('express');
//use an enviornmental variable to tell our app to use that port
const PORT = process.env.PORT || 3001;
const app = express();

//add some middleware to parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
//middleware parse incoming JSON data
app.use(express.json());
app.use(express.static('public'))
//*both of these must be used every time you create a server that's looking to accept post data

//create a route that the front-end can request data from.
//start by requiring the data
//const notesDir = require('./db/db.json');
const readFileAsync = util.promisify(fs.readFile)
const writeFileAsync = util.promisify(fs.writeFile)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/assets/index.html'));
});

//add the route (the get method requires 2 arguments (string describing route and callback function))
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/assets/notes.html'));
  //use the send method from the res parameter to send the string
});

// GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get('/api/notes', (req, res) => {
  readFileAsync("./db/db.json", "utf8")
    .then(notes => {
      const parsedNotes = JSON.parse(notes) || []
      res.json(parsedNotes)
    })
    .catch(err => console.log(err));
})

// POST /api/notes should receive a new note to save on the request body, 
//add it to the db.json file, 
//and then return the new note to the client. 
//You'll need to find a way to give each note a unique id 
//when it's saved (look into npm packages that could do this for you).

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = customId({})
  readFileAsync("./db/db.json", "utf8")
    .then(notes => {
      const parsedNotes = JSON.parse(notes) || []
      parsedNotes.push(newNote)
      writeFileAsync("./db/db.json", JSON.stringify(parsedNotes))
        .then(() => res.json(parsedNotes))
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
});

//DELETE /api/notes/:id should receive a query parameter 
//containing the id of a note to delete. 
//In order to delete a note, 
//you'll need to read all notes from the db.json file, 
//remove the note with the given id property, 
//and then rewrite the notes to the db.json file.

app.delete('/api/notes/:id', (req, res) => {
  const {id} = req.params
  readFileAsync("./db/db.json", "utf8")
    .then(notes => {
      const parsedNotes = JSON.parse(notes) || []
      filteredNotes = parsedNotes.filter(note => id !== note.id)

      writeFileAsync("./db/db.json", JSON.stringify(filteredNotes))
        .then(() => res.json(filteredNotes))
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err));
})




// at the bottom 
//replace harcoded value of 3001 with the PORT variable
app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});