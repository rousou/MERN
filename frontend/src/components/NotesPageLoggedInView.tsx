import { useEffect, useState } from 'react';
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import Note from '../components/Note';
import { Note as NoteModel } from '../models/note';
import * as NotesApi from "../network/notes_api";
import styles from "../styles/NotePage.module.css";
import styleUtils from "../styles/utils.module.css";
import AddNoteDialog from "./AddEditNoteDialog";


const NotesPageLoggedInView = () => {

    const [notes, setNotes] = useState<NoteModel[]>([]);
    const [noteLoading, setNoteLoading] = useState(true);
    const [showNoteLoadingError, setShowNoteLoadingError] = useState(false)

    const [showAddNoteDialog, setshowAddNoteDialog] = useState(false);
    const [noteToEdit, setNoteToEdit] = useState<NoteModel | null>(null);

    useEffect(() => {
        async function loadNotes() {
            try {
                setShowNoteLoadingError(false);
                setNoteLoading(true);
                const notes = await NotesApi.fetchNotes();
                setNotes(notes);
            } catch (error) {
                console.error(error);
                setShowNoteLoadingError(true);
            } finally {
                setNoteLoading(false);
            }
        }
        loadNotes();
    }, []);

    async function deleteNote(note: NoteModel) {
        try {
            await NotesApi.deleteNote(note._id);
            setNotes(notes.filter(existingNote => existingNote._id !== note._id))
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    const notesGrid =
        <Row xs={1} md={2} xl={3} className={`g-4 ${styles.noteGrid}`}>
            {notes.map(note => (
                <Col key={note._id}>
                    <Note
                        note={note}
                        className={styles.note}
                        onNoteClicked={setNoteToEdit}
                        onDeleteNoteClicked={deleteNote}
                    />
                </Col>
            ))}
        </Row>

    return (
        <>
            <Button
                className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
                onClick={() => setshowAddNoteDialog(true)}>
                <FaPlus />
                Add new note
            </Button>

            {noteLoading && <Spinner animation='border' variant='primary' />}
            {showNoteLoadingError && <p>Something went wrong. Please refresh the page</p>}
            {!noteLoading && !showNoteLoadingError &&
                <>
                    {notes.length > 0
                        ? notesGrid
                        : <p>You don't have any notes yet</p>
                    }
                </>
            }

            {showAddNoteDialog && // if true show next
                <AddNoteDialog
                    onDismiss={() => setshowAddNoteDialog(false)}
                    onNoteSaved={(newNote) => {
                        setNotes([...notes, newNote]);
                        setshowAddNoteDialog(false);
                    }}
                />
            }
            {noteToEdit &&
                <AddNoteDialog
                    noteToEdit={noteToEdit}
                    onDismiss={() => setNoteToEdit(null)}
                    onNoteSaved={(updatedNote) => {
                        setNotes(notes.map(existingNote => existingNote._id === updatedNote._id ? updatedNote : existingNote))
                        setNoteToEdit(null);
                    }}
                />
            }
        </>
    );
}

export default NotesPageLoggedInView;