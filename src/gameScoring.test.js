import { computeNextGameState } from "./gameScoring";

describe("User story 1", () => {
  describe("Next gameState computation", () => {
    it("should compute basic next score", () => {
      expect(computeNextGameState({ scores: [0, 0] }, 0)).toEqual({
        scores: [15, 0]
      });
      expect(computeNextGameState({ scores: [15, 0] }, 0)).toEqual({
        scores: [30, 0]
      });
      expect(computeNextGameState({ scores: [30, 0] }, 0)).toEqual({
        scores: [40, 0]
      });
      expect(computeNextGameState({ scores: [40, 15] }, 0)).toEqual({
        scores: ["Win game", 15],
        winner: 0
      });
      expect(computeNextGameState({ scores: [40, 40] }, 0)).toEqual({
        scores: ["Win game", 40],
        winner: 0
      });
    });
    it("should treat both players equally", () => {
      const flipScores = ([s0, s1]) => [s1, s0];
      const validScores = [0, 15, 30, 40];
      validScores.forEach(s0 => {
        validScores.forEach(s1 => {
          const initialScores = [s0, s1];
          const { scores: nextScores0 } = computeNextGameState(
            { scores: initialScores },
            0 /* player 0 scores a point */
          );
          const { scores: nextScores1 } = computeNextGameState(
            { scores: flipScores(initialScores) },
            1 /* player 1 scores a point */
          );
          expect(flipScores(nextScores0)).toEqual(nextScores1);
        });
      });
    });
    it("should not mutate the current gameState", () => {
      const currentGameState = { scores: [0, 0] };
      const nextGameState = computeNextGameState(currentGameState, 0);
      expect(currentGameState).toEqual({ scores: [0, 0] });
      expect(nextGameState).not.toEqual(currentGameState);
    });
  });

  describe("Edges cases and data validation", () => {
    it("should throw an exception when receiving wrong gameState format", () => {
      const errorMessage =
        "the gameState should contain an array of scores for both players";
      expect(() => computeNextGameState()).toThrowError(errorMessage);
      expect(() => computeNextGameState({})).toThrowError(errorMessage);
      expect(() => computeNextGameState({ scores: [] })).toThrowError(
        errorMessage
      );
      expect(() => computeNextGameState({ scores: [10, 10, 10] })).toThrowError(
        errorMessage
      );
    });
    it("should throw an exception when receiving wrong scores", () => {
      const errorMessage = "the only valid scores are 0,15,30,40";
      expect(() => computeNextGameState({ scores: [10, 15] })).toThrowError(
        errorMessage
      );
      expect(() => computeNextGameState({ scores: [15, "15"] })).toThrowError(
        errorMessage
      );
      expect(() => computeNextGameState({ scores: [-15, 15] })).toThrowError(
        errorMessage
      );
      expect(() => computeNextGameState({ scores: ["15", 15] })).toThrowError(
        errorMessage
      );
      expect(() => computeNextGameState({ scores: ["15", 15] })).toThrowError(
        errorMessage
      );
      expect(() =>
        computeNextGameState({ scores: ["Win game", 15] })
      ).toThrowError(errorMessage);
    });
    it("should throw an exception when neither player 0 nor player 1 scored a point", () => {
      const errorMessage =
        "the player who scores the point should either be 0 or 1.";
      expect(() => computeNextGameState({ scores: [0, 0] })).toThrowError(
        errorMessage
      );
      expect(() => computeNextGameState({ scores: [0, 0] }, -1)).toThrowError(
        errorMessage
      );
      expect(() => computeNextGameState({ scores: [0, 0] }, 2)).toThrowError(
        errorMessage
      );
      expect(() => computeNextGameState({ scores: [0, 0] }, 42)).toThrowError(
        errorMessage
      );
    });
  });
});
