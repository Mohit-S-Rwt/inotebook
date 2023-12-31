import NoteContext from "./noteContext";
import { useState } from "react";

const NoteState = (props) => {
const host = "http://localHost:5000"

  const notesInitial = [
  ];

  const [notes, setNotes] = useState(notesInitial);

  // get all notes by api
  const getNotes = async () => {
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token':"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjI1NDI2NGE1NzVmOWFkNjhhNmYwNDI3In0sImlhdCI6MTY0OTY4MTk5NH0.O4IPbF8oZCPb9dhcYKkSXoPa8pjueXoWJEkr_BW1WJk"
      },
    });
    const json = await response.json()
    // console.log(json)
    setNotes(json)
 };

  // Add a note

  const addNote = async (title,description,tag) => {
      const response = await fetch(`${host}/api/notes/addnote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token':"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjI1NDI2NGE1NzVmOWFkNjhhNmYwNDI3In0sImlhdCI6MTY0OTY4MTk5NH0.O4IPbF8oZCPb9dhcYKkSXoPa8pjueXoWJEkr_BW1WJk"
        },
        body: JSON.stringify({title,description,tag}) 
      });
     const json = await response.json(); 
    //  console.log(json)
     const note={ title: title, description:  description, _id: 6466724454543623998977 }
    ;
    setNotes(notes.concat(note));
  };
  //  Delete a note
  const deleteNote = async (id) => {
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'auth-token':"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjI1NDI2NGE1NzVmOWFkNjhhNmYwNDI3In0sImlhdCI6MTY0OTY4MTk5NH0.O4IPbF8oZCPb9dhcYKkSXoPa8pjueXoWJEkr_BW1WJk"
      }
      
    });
      const json = response.json(); 
      console.log(json)
    console.log("Deleting the note with id" +id)
    const newNotes = notes.filter((note)=>{return note._id!==id})
    setNotes(newNotes);
  };

  //  edit a note
  const editNote = async (id,title,description,tag) => {
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'auth-token':"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjI1NDI2NGE1NzVmOWFkNjhhNmYwNDI3In0sImlhdCI6MTY0OTY4MTk5NH0.O4IPbF8oZCPb9dhcYKkSXoPa8pjueXoWJEkr_BW1WJk"
      },
      body: JSON.stringify({title,description,tag}) 
    });
   const json = response.json()
   console.log(json) 
  //  console.log("updating the note with id" +id)
  let newNotes = JSON.parse(JSON.stringify(notes))
   

// Logic to edit in client
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if(element._id === id){
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    // console.log(newNotes)
    setNotes(newNotes);
  };

  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote,getNotes }}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
