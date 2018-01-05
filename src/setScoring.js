import { assert } from "./assert";
import { computeNextGameState, flipGameState, flipScores } from "./gameScoring";

/**
 * Enforces the set state's invariants
 */
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

/**
 * It returns the next scores provided that the player 0 scored a point.
 * When the player wins the set, the next game state will be reset.
 *
 * @param {*} scores the current set's scores for both players
 * @param {*} nextGameState the temporary next game state
 */
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

/**
 * Utility function to exchanges the players roles.
 * The player 0's set state becomes player 1's, and vice versa.
 * @argument {*} setState
 */
function flipSetState(setState) {
  return {
    gameState: flipGameState(setState.gameState),
    scores: flipScores(setState.scores),
    winner: setState.winner !== undefined ? 1 - setState.winner : undefined
  };
}

export function computeNextSetState(setState, playerWhoScored) {
  validateSetState(setState);
  if (playerWhoScored === 1) {
    // Since the rules apply indifferently to both players,
    // we can flip the set state in the input and the output to simplify the implementation.
    return flipSetState(computeNextSetState(flipSetState(setState), 0));
  }
  const nextGameState = computeNextGameState(
    setState.gameState,
    playerWhoScored
  );
  // We know now that playerWhoScored can only be 0
  const nextSetState = computeNextScores(setState.scores, nextGameState);
  // Check the Tie-Break rule
  if (
    nextSetState.scores[0] >= 6 &&
    Math.abs(nextSetState.scores[1] - nextSetState.scores[0]) >= 2
  ) {
    nextSetState.winner = 0;
  }

  return nextSetState;
}
