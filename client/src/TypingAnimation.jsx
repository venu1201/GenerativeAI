import React from 'react';
import "./Typing.css"
const TypingAnimation = ({ isTyping }) => (
  <div className={`typing ${isTyping ? 'typing-active' : ''}`}>
    <div className="typing__dot"></div>
    <div className="typing__dot"></div>
    <div className="typing__dot"></div>
  </div>
);

export default TypingAnimation;
