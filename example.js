import prompt from "prompt";
import { computeNextSetState } from "./src/setScoring";

/**
 * Prompt the user to input the id of the player that won the point
 * then proceeds to passing this info to the callback.
 *
 * @param {*} cb callback
 */
function getPlayerWhoScored(cb) {
  prompt.get(
    [
      {
        description: "Who won the point?",
        type: "string",
        pattern: /^(0|1)$/,
        message: "Player should be either 0 or 1",
        required: true
      }
    ],
    function(err, result) {
      if (!err) {
        cb(+result.question);
      }
    }
  );
}

/**
 * A simplified left_pad implementation for grid displays
 */
function left_pad(str) {
  return ("          " + str).slice(-9);
}

/**
 * Display the set state into a grid
 * @example <caption>When currentState is { gameState: { scores: [40, "ADVANTAGE"]}, scores:[2, 1] }</caption>
 *          |     Games |    Points
 * Player 0 |         2 |        40
 * Player 1 |         1 | ADVANTAGE
 *
 * @param {*} currentState the state to be displayed
 */
function displayScore(currentState) {
  console.log(`
         | ${left_pad("Games")} | ${left_pad("Points")}
Player 0 | ${left_pad(currentState.scores[0])} | ${left_pad(
    currentState.gameState.scores[0]
  )}
Player 1 | ${left_pad(currentState.scores[1])} | ${left_pad(
    currentState.gameState.scores[1]
  )}
`);
}

/**
 * Runs the complete tennis match
 */
function runTennisMatch() {
  /**
   * Runs a single step of the match, then recall itself (asynchronously) when their is no winner yet.
   * @param {*} currentState The current state of the match
   */
  function runTennisMatch_stepper(currentState) {
    getPlayerWhoScored(function(playerWhoScoredAPoint) {
      const nextState = computeNextSetState(
        currentState,
        playerWhoScoredAPoint
      );
      displayScore(nextState);
      if (nextState.winner !== undefined) {
        console.log(`Player ${nextState.winner} has won the game 🎉`);
      } else {
        runTennisMatch_stepper(nextState);
      }
    });
  }

  const initialState = {
    gameState: {
      scores: [0, 0]
    },
    scores: [0, 0]
  };
  runTennisMatch_stepper(initialState);
}

prompt.start();
runTennisMatch();
