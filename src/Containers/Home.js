import React, { useState, useEffect } from "react";
import {
  PageHeader,
  ListGroup,
  InputGroup,
  FormControl,
  ListGroupItem
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { API, JS } from "aws-amplify";
import Clock from "react-live-clock";
import "./Home.css";

export default function Home(props) {
  const [notes, setNote] = useState([]);
  const [isFocuse, setIsFocus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [focusNote, setFocusNote] = useState();

  useEffect(() => {
    async function onLoad() {
      if (!props.isAuthenticated) {
        return;
      }

      try {
        const notes = await loadFocusNotes();
        if (notes == null || notes.length == 0) {
          setIsFocus(false);
        } else {
          if (notes.findIndex(i => i.completedAt === 0) !== -1) {
            setFocusNote(notes[notes.findIndex(i => i.completedAt === 0)]);
            setIsFocus(true);
          } else {
            setIsFocus(false);
          }
        }
        setNote(notes);
      } catch (e) {
        alert(e);
      }

      setIsLoading(false);
    }

    onLoad();
  }, [props.isAuthenticated]);

  function loadFocusNotes() {
    return API.get("notes", "/notes/focus");
  }

  function renderNotAuthenticated() {
    const number = Math.floor(Math.random() * 2);
    return number === 1 ? (
      <div className="lander">
        <Clock className="clock" format={"HH:mm:ss"} ticking={true} />
        <h3>"Lost time is never found again."</h3>
        <p>by Benjamin Franklin</p>
      </div>
    ) : (
      <div className="lander">
        <Clock className="clock" format={"HH:mm:ss"} ticking={true} />

        <h3>"The future depends on what we do in the present."</h3>
        <p>by Mahatma Gandhi</p>
      </div>
    );
  }

  function renderAuthenticatedSecond(note) {
    return isFocuse && note != null ? (
      <div className="lander">
        <h3 className="clock">00:00:42</h3>
        <h3>Today, Your mission is .. </h3>
        <div className="mission">
          <LinkContainer key={note.noteId} to={`/notes/${note.noteId}`}>
            <ListGroupItem header={note.content.trim().split("\n")[0]}>
              {"Created: " + new Date(note.createdAt).toLocaleString()}
            </ListGroupItem>
          </LinkContainer>
        </div>
      </div>
    ) : (
      <div className="lander">
        <h2>what is your main focus for today?</h2>
        <div className="mission">
          <LinkContainer key="new" to="/notes/new">
            <ListGroupItem>
              <h4>
                <b>{"\uFF0B"}</b> Create a new mission
              </h4>
            </ListGroupItem>
          </LinkContainer>
        </div>
      </div>
    );
  }

  function renderAuthenticated() {
    return <div>{!isLoading && renderAuthenticatedSecond(focusNote)}</div>;
  }

  return (
    <div className="Home container">
      {props.isAuthenticated ? renderAuthenticated() : renderNotAuthenticated()}
    </div>
  );
}
