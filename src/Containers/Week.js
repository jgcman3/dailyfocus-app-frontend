import React, { useState, useEffect } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { API } from "aws-amplify";
import "./Week.css";

export default function Week(props) {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      if (!props.isAuthenticated) {
        return;
      }

      try {
        const notes = await loadNotes();
        setNotes(notes);
      } catch (e) {
        alert(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [props.isAuthenticated]);

  function loadNotes() {
    return API.get("notes", "/notes");
  }

  function renderNotesList(notes) {
    return notes.map(function(note) {
      return (
        <LinkContainer key={note.noteId} to={`/notes/${note.noteId}`}>
          <ListGroupItem header={note.content.trim().split("\n")[0]}>
            {"Created: " + new Date(note.createdAt).toLocaleString()}
            {note.completedAt == 0
              ? ""
              : "  ( " +
                Math.floor(
                  (note.completedAt - note.createdAt) / ((3600 * 1000) / 60)
                ) +
                " mins )"}
          </ListGroupItem>
        </LinkContainer>
      );
    });
  }

  function renderNotes() {
    return (
      <div className="notes">
        <PageHeader>This week</PageHeader>
        <ListGroup>{!isLoading && renderNotesList(notes)}</ListGroup>
      </div>
    );
  }

  return <div className="Week container">{renderNotes()}</div>;
}
