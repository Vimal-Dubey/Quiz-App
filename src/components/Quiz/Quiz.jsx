import { useState } from "react";
import { resultInitialState } from "../../constant";
import AnswerTimer from "../AnswerTimer/answerTimer";
import './Quiz.scss';

const Quiz = ({ questions }) => {
  const [curQues, setCurQues] = useState(0);
  const [answerIdx, setAnswerIdx] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [result, setResult] = useState(resultInitialState);
  const [showResult, setShowResult] = useState(false);
  const { question, choices, correctAnswer } = questions[curQues];
  const [showAnswerTimer, setShowAnswerTimer] = useState(true);
  const handleTimeUp = () => {
      setAnswer(false);
      onClickNext(false);
  }
  const onTryAgain = ()=>{
    setResult(resultInitialState);
    setShowResult(false);
  }
  const onAnswerClick = (answer, index) => {
    setAnswerIdx(index);
    setAnswer(answer);
    if (answer === correctAnswer) {
      setAnswer(true);
    } else {
      setAnswer(false);
    }
  };

  const onClickNext = (finalAnswer) => {
    setShowAnswerTimer(false);
    setResult((prev) => {
      return finalAnswer
        ? {
            ...prev,
            score: prev.score + 5,
            correctAnswers: prev.correctAnswers + 1,
          }
        : {
            ...prev,
            wrongAnswers: prev.wrongAnswers + 1,
          };
    });
  
    setAnswerIdx(null);
    setAnswer(null);
  
    if (curQues !== questions.length - 1) {
      setCurQues((prev) => prev + 1);
    } else {
      setCurQues(0);
      setShowResult(true);
    }
    setTimeout(()=>{
      setShowAnswerTimer(true);
    })
  };

  return (
    <div className="quiz-container">
      {!showResult ? (
        <>
          { showAnswerTimer && <AnswerTimer duration={10} onTimeUp={handleTimeUp}/> }
          <span className="active-question-no">{curQues + 1}</span>
          <span className="total-question">/{questions.length}</span>
          <h2>{question}</h2>
          <ul>
            {choices.map((answer, index) => (
              <li
                className={answerIdx === index ? "selected" : null}
                onClick={() => onAnswerClick(answer, index)}
                key={answer}
              >
                {answer}
              </li>
            ))}
          </ul>
          <div className="footer">
            <button onClick={()=>onClickNext(answer)} disabled={answerIdx === null}>
              {curQues === questions.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </>
      ) : (
        <div className="result">
          <h3>Result</h3>
          <p>Total questions: <span>{questions.length}</span></p>
          <p>Total score: <span>{result.score}</span></p>
          <p>Correct answers: <span>{result.correctAnswers}</span></p>
          <p>Wrong answers: <span>{result.wrongAnswers}</span></p>
          <button onClick={onTryAgain}>Try again</button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
