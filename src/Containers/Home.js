import React, { useState, useEffect } from "react";
import { ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { API } from "aws-amplify";
import Clock from "react-live-clock";
import "./Home.css";

export default function Home(props) {
  const [notes, setNote] = useState([]);
  const [isFocuse, setIsFocus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [focusNote, setFocusNote] = useState();
  const [timeCount, setTimeCount] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const calculateCountUp = () => {
    const difference =
      focusNote != null ? +new Date() - focusNote.createdAt : 0;
    let countUp = {};
    if (difference > 0) {
      countUp = {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    return countUp;
  };

  setTimeout(() => {
    setTimeCount(calculateCountUp());
  }, 1000);

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
    return (
      <div className="lander">
        <Clock className="clock" format={"HH:mm:ss"} ticking={true} />
        <h3>"The future depends on what we do in the present."</h3>
        <p>by Mahatma Gandhi</p>
      </div>
    );
  }

  function renderAuthenticatedSecond(note) {
    const timerComponents = [];
    if (
      timeCount.hours != null &&
      timeCount.minutes != null &&
      timeCount.seconds != null
    ) {
      timerComponents.push(
        <span>
          {(timeCount.hours > 9 ? timeCount.hours : "0" + timeCount.hours) +
            ":" +
            (timeCount.minutes > 9
              ? timeCount.minutes
              : "0" + timeCount.minutes) +
            ":" +
            (timeCount.seconds > 9
              ? timeCount.seconds
              : "0" + timeCount.seconds)}
        </span>
      );
    }

    return isFocuse && note != null ? (
      <div className="lander">
        <h3>Today, Your mission is .. </h3>
        <div className="mission">
          <LinkContainer key={note.noteId} to={`/notes/${note.noteId}`}>
            <ListGroupItem header={note.content.trim().split("\n")[0]}>
              {"Created: " + new Date(note.createdAt).toLocaleString()}
            </ListGroupItem>
          </LinkContainer>
        </div>
        <h3 className="clock">{timerComponents}</h3>
      </div>
    ) : (
      <div className="lander">
        <Clock className="clock" format={"HH:mm:ss"} ticking={true} />
        <h3>"The future depends on what we do in the present."</h3>
        <p>by Mahatma Gandhi</p>
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
