import { assert } from "./assert";
import { computeNextGameState, flipGameState, flipScores } from "./gameScoring";

function validateSetState(setState) {
  assert(
    setState && setState.scores && setState.scores.length === 2,
    "the setState should contain an array of scores for both players"
  );
  assert(
    ![0, 1].includes(setState.winner),
    "the tennis match should still be going"
  );
  setState.scores.forEach(score =>
    assert(
      Number.isInteger(score) && score >= 0,
      `A score should be a positive integer`
    )
  );
  assert(
    !(setState.scores[0] >= 6 || setState.scores[1] >= 6) ||
      Math.abs(setState.scores[1] - setState.scores[0]) < 2,
    `Wrong scores. A player should have won the set.`
  );
}

function computeNextScores(scores, nextGameState) {
  const { winner } = nextGameState;
  if (winner === 0) {
    return {
      gameState: {
        scores: [0, 0]
      },
      scores: [scores[0] + 1, scores[1]]
    };
  }
  return {
    gameState: nextGameState,
    scores
  };
}

function computeWinner(scores) {
  if (scores[0] >= 6 && Math.abs(scores[1] - scores[0]) >= 2) {
    return 0;
  }
  return undefined;
}

function flipSetState(setState) {
  return {
    ...setState,
    gameState: flipGameState(setState.gameState),
    scores: flipScores(setState.scores),
    winner: setState.winner !== undefined ? 1 - setState.winner : undefined
  };
}

export function computeNextSetState(setState, playerWhoScored) {
  validateSetState(setState);
  if (playerWhoScored === 1) {
    return flipSetState(computeNextSetState(flipSetState(setState), 0));
  }
  const nextGameState = computeNextGameState(
    setState.gameState,
    playerWhoScored
  );
  const nextSetState = computeNextScores(setState.scores, nextGameState);

  return {
    ...nextSetState,
    winner: computeWinner(nextSetState.scores)
  };
}
