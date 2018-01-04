import { assert } from "./assert";

const validScores = [0, 15, 30, 40, "ADVANTAGE"];

function validateGameState(gameState) {
  assert(
    gameState && gameState.scores && gameState.scores.length === 2,
    "the gameState should contain an array of scores for both players"
  );
  assert(![0, 1].includes(gameState.winner), "the game should still be going");
  gameState.scores.forEach(score =>
    assert(
      validScores.includes(score),
      `the only valid scores are ${validScores}`
    )
  );
  assert(
    !(gameState.scores[1] === "ADVANTAGE" && gameState.scores[0] !== 40) &&
      !(gameState.scores[0] === "ADVANTAGE" && gameState.scores[1] !== 40),
    "A player can be in advantage only when the other has a score of 40"
  );
}

function computeNextScores([score0, score1]) {
  if (score1 === "ADVANTAGE") {
    return [40, 40];
  }
  switch (score0) {
    case 0:
      return [15, score1];
    case 15:
      return [30, score1];
    case 30:
      return [40, score1];
    case 40:
      return [score1 === 40 ? "ADVANTAGE" : "Win game", score1];
    case "ADVANTAGE":
      return ["Win game", score1];
  }
}

export function flipScores([s0, s1]) {
  return [s1, s0];
}
export function flipGameState(gameState) {
  return {
    ...gameState,
    scores: flipScores(gameState.scores),
    winner: gameState.winner !== undefined ? 1 - gameState.winner : undefined
  };
}

export function computeNextGameState(gameState, playerWhoScored) {
  validateGameState(gameState);
  assert(
    [0, 1].includes(playerWhoScored),
    "the player who scores the point should either be 0 or 1."
  );
  if (playerWhoScored === 1) {
    return flipGameState(computeNextGameState(flipGameState(gameState), 0));
  }
  const nextScores = computeNextScores(gameState.scores);

  return {
    ...gameState,
    scores: nextScores,
    winner: nextScores[0] === "Win game" ? 0 : undefined
  };
}
