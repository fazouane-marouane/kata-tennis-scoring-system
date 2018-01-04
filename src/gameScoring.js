import { assert } from "./assert";

const validScores = [0, 15, 30, 40];

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
}

function computeNextScore(score) {
  switch (score) {
    case 0:
      return 15;
    case 15:
      return 30;
    case 30:
      return 40;
    case 40:
      return "Win game";
  }
}

export function computeNextGameState(gameState, playerWhoScored) {
  validateGameState(gameState);
  assert(
    [0, 1].includes(playerWhoScored),
    "the player who scores the point should either be 0 or 1."
  );
  const nextScores = [gameState.scores[0], gameState.scores[1]];
  nextScores[playerWhoScored] = computeNextScore(nextScores[playerWhoScored]);
  let winner;
  if (nextScores[playerWhoScored] === "Win game") {
    winner = playerWhoScored;
  }
  return {
    ...gameState,
    scores: nextScores,
    winner
  };
}
