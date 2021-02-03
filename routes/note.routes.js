


module.exports =  (king) => {
    
    const notes = require('../controllers/note.controller.js');

//Create a new Note
king.post('/notes',notes.create);

// Retrieve all notes
king.get('/notes',notes.findAll);

//Retrieve a single note with note Id
king.get('/:noteId',notes.findOne);

//Update a single note with note Id
king.put('/:noteId',notes.Update);

//Delete a single note with note Id 
king.delete('/:noteId',notes.delete);
}