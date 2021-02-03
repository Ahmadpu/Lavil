const Note = require('../models/note.model');

//Create and save a new Note
exports.create = (req,res) =>{
    //Validate Request
    if(!req.body.content){
        return res.status(400).send({
            message: "Note content cannot be empty"
        });
    }
    //Create a Note
    const note = new Note({
        title: req.body.title || 'Untitled note',
        content : req.body.content
    });
    //Save a Note
    note.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message : err.message|| "Some error while creating the Note."
        });
    });
};

//Retrieve and return all notes from the database
exports.findAll = (req,res) =>{
    Note.find()
    .then(notes =>{
        res.send(notes);
    }).catch(err =>{
        res.status(500).send({
            message : err.message||"Some error occur while retrieving Notes"
        });
    });
};
//Find a single note with a noteId
exports.findOne = (req,res) =>{
    Note.findById(req.params.noteId)
    .then(note =>{
        if(!note){
            return res.status(404).send({
                message : "Note not found with Id" + req.params.noteId
            });
        };
        res.send(note);
    }).catch(err =>{
        if(err.kind === 'ObjectId'){
            return res.status(404).send({
                message : "Note not found with Id" + req.params.noteId
            });
        };
        res.status(500).send({
            message : err.message || " Error retrieving note with Id"
        });
    });
};

//Update a note with identified Id by nodeId in request
exports.Update = (req,res) => {
    //Validate Request
    if(!req.body.content) {
        return res.status(400).send({
            message: "Note content cannot be empty"
        });
    };
    //Find a note and update it with the request body
    Note.findByIdAndUpdate(req.params.noteId,{
        title : req.body.title || "Untitled Note",
        content : req.body.content
    },{new : true})
    .then(note=> {
        if(!note){
            return res.status(500).send({
                message: "Note not found with id"+ req.params.noteId
            });
        }   
        res.send(note);
    }).catch(err =>{
        if(err.kind === 'ObjectId'){
            return res.status(404).send({
                message: "Note not found with id" + req.params.noteId
            });
        }
        return res.status(500).send({
            message : "Error updating note with Id" + req.params.noteId
        });
    });
};
//Delete a note with the specified noteId in request
exports.delete = (req,res) =>{
    Note.findByIdAndRemove(req.params.noteId)
    .then(note =>{
        if(!note){
            return res.status(404).send({
                message : "Node not found with Id" + req.params.noteId
            });
        }
        res.send({  message: "Note deleted successfully"    });
    }).catch(err =>{
        if(err.kind === 'ObjectId'|| err.name === 'Not found'){
            return res.status(404).send({
                message : "Note not found with id " + req.params.noteId
            });
        }
        return res.status(500).send({
            message :  "Could not delete note with id" + req.params.noteId
        });
        });

    
};