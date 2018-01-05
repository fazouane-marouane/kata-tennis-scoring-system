import prompt from "prompt";
import { computeNextSetState } from "./src/setScoring";

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

function left_pad(n) {
  return ("          " + n).slice(-9);
}

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

function runSingleStep(currentState) {
  getPlayerWhoScored(function(playerWhoScoredAPoint) {
    const nextState = computeNextSetState(currentState, playerWhoScoredAPoint);
    displayScore(nextState);
    if (nextState.winner !== undefined) {
      console.log(`Player ${nextState.winner} has won the game 🎉`);
    } else {
      runSingleStep(nextState);
    }
  });
}

function runTennisMatch() {
  runSingleStep({
    gameState: {
      scores: [0, 0]
    },
    scores: [0, 0]
  });
}

prompt.start();

runTennisMatch();
