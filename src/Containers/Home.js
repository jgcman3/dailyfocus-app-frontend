import React, { useState, useEffect } from "react";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { API } from "aws-amplify";
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
        <h1>_________________</h1>
        <p>Let's focus on just one thing.</p>
      </div>
    );
  }

  function renderAuthenticated() {
    return (
      <div className="lander">
        <h1>00:00:00</h1>
        <p>Let's focus on just one thing.</p>
        <h3>what is your main focus for today?</h3>
        <h4>_________________________________</h4>
        {/* Your mission is .. */}
      </div>
    );
  }

  return (
    <div className="Home container">
      {props.isAuthenticated ? renderAuthenticated() : renderNotAuthenticated()}
    </div>
  );
}
