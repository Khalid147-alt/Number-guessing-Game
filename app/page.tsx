"use client"
import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '@/app/components/home.module.css';

export default function Home() {
  const [secretNumber, setSecretNumber] = useState(0);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    generateSecretNumber();
    const storedHighScore = localStorage.getItem('highScore');
    if (storedHighScore) setHighScore(parseInt(storedHighScore));
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted) {
      timer = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted]);

  const generateSecretNumber = () => {
    setSecretNumber(Math.floor(Math.random() * 10) + 1);
  };

  const handleGuess = () => {
    if (!gameStarted) setGameStarted(true);
    
    const userGuess = parseInt(guess);
    setAttempts(attempts + 1);

    if (isNaN(userGuess) || userGuess < 1 || userGuess > 10) {
      setMessage('Please enter a valid number between 1 and 10!');
    } else if (userGuess === secretNumber) {
      setMessage(`Congratulations! You guessed it in ${attempts + 1} attempts!`);
      if (attempts + 1 < highScore || highScore === 0) {
        setHighScore(attempts + 1);
        localStorage.setItem('highScore', (attempts + 1).toString());
      }
      setGameStarted(false);
    } else if (userGuess < secretNumber) {
      setMessage('Too low! Try again.');
    } else {
      setMessage('Too high! Try again.');
    }
    setGuess('');
  };

  const resetGame = () => {
    generateSecretNumber();
    setGuess('');
    setMessage('');
    setAttempts(0);
    setTimeElapsed(0);
    setGameStarted(false);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Number Guessing Game</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Number Guessing Game</h1>
        <p className={styles.description}>Guess a number between 1 and 10</p>

        <div className={styles.gameInfo}>
          <p>Attempts: {attempts}</p>
          <p>High Score: {highScore}</p>
          <p>Time Elapsed: {timeElapsed}s</p>
        </div>

        <div className={styles.inputSection}>
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Enter your guess"
            className={styles.input}
          />
          <button onClick={handleGuess} className={styles.button}>
            Guess
          </button>
        </div>

        <p className={styles.message}>{message}</p>

        <button onClick={resetGame} className={styles.resetButton}>
          Reset Game
        </button>
      </main>
    </div>
  );
}
