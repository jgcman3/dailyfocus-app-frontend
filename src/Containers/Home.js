import React, { useState, useEffect } from "react";
import { InputGroup, FormControl } from "react-bootstrap";
import { API } from "aws-amplify";
import Clock from "react-live-clock";
import "./Home.css";

export default function Home(props) {
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

  function renderNotAuthenticated() {
    return (
      <div className="lander">
        <Clock className="clock" format={"HH:mm:ss"} ticking={true} />
        <h2>"Lost time is never found again."</h2>
        <p>by Benjamin Franklin</p>
      </div>
    );
  }

  function renderAuthenticated() {
    return (
      <div className="lander">
        <h1>00:00:00</h1>
        {/* <p>Let's focus on just one thing.</p> */}
        <h2>what is your main focus for today?</h2>
        <form class="js-form form">
          <input type="text" placeholder="What is your name?" />
        </form>
        <h4>_________________________________</h4>
        {/* Your mission is .. */}
      </div>
    );
  }

  return (
    <div className="Home container">
      {!props.isAuthenticated
        ? renderAuthenticated()
        : renderNotAuthenticated()}
    </div>
  );
}
