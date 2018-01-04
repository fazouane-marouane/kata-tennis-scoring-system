import { computeNextSetState } from "./setScoring";

describe("SetScoring", () => {
  describe("Next setState computation", () => {
    it("should update the game state leaving the set scores untouched when the game has not yet been won", () => {
      expect(
        computeNextSetState(
          {
            gameState: {
              scores: [0, 0]
            },
            scores: [0, 0]
          },
          0
        )
      ).toEqual({
        gameState: {
          scores: [15, 0]
        },
        scores: [0, 0]
      });
      expect(
        computeNextSetState(
          {
            gameState: {
              scores: [40, 40]
            },
            scores: [2, 0]
          },
          1
        )
      ).toEqual({
        gameState: {
          scores: [40, "ADVANTAGE"]
        },
        scores: [2, 0]
      });
    });
    it("should update the set scores when the current game has been won", () => {
      expect(
        computeNextSetState(
          {
            gameState: {
              scores: [15, 40]
            },
            scores: [2, 0]
          },
          1
        )
      ).toEqual({
        gameState: {
          scores: [0, 0]
        },
        scores: [2, 1]
      });
      expect(
        computeNextSetState(
          {
            gameState: {
              scores: ["ADVANTAGE", 40]
            },
            scores: [4, 0]
          },
          0
        )
      ).toEqual({
        gameState: {
          scores: [0, 0]
        },
        scores: [5, 0]
      });
    });
    it("should determine a winner", () => {
      expect(
        computeNextSetState(
          {
            gameState: {
              scores: [0, 40]
            },
            scores: [4, 5]
          },
          1
        )
      ).toEqual({
        gameState: {
          scores: [0, 0]
        },
        scores: [4, 6],
        winner: 1
      });
      expect(
        computeNextSetState(
          {
            gameState: {
              scores: [0, 40]
            },
            scores: [6, 6]
          },
          1
        )
      ).toEqual({
        gameState: {
          scores: [0, 0]
        },
        scores: [6, 7],
        winner: 1
      });
      expect(
        computeNextSetState(
          {
            gameState: {
              scores: [40, 15]
            },
            scores: [6, 5]
          },
          0
        )
      ).toEqual({
        gameState: {
          scores: [0, 0]
        },
        scores: [7, 5],
        winner: 0
      });
    });
    it("should handle the special case of score 6-5", () => {
      expect(
        computeNextSetState(
          {
            gameState: {
              scores: [30, 40]
            },
            scores: [5, 5]
          },
          1
        )
      ).toEqual({
        gameState: {
          scores: [0, 0]
        },
        scores: [5, 6]
      });
      expect(
        computeNextSetState(
          {
            gameState: {
              scores: ["ADVANTAGE", 40]
            },
            scores: [6, 5]
          },
          0
        )
      ).toEqual({
        gameState: {
          scores: [0, 0]
        },
        scores: [7, 5],
        winner: 0
      });
    });
  });

  describe("Edges cases and data validation", () => {
    it("should throw an exception when receiving wrong setState format", () => {
      const errorMessage =
        "the setState should contain an array of scores for both players";
      expect(() => computeNextSetState()).toThrowError(errorMessage);
      expect(() => computeNextSetState({})).toThrowError(errorMessage);
      expect(() => computeNextSetState({ scores: [] })).toThrowError(
        errorMessage
      );
      expect(() => computeNextSetState({ scores: [10, 10, 10] })).toThrowError(
        errorMessage
      );
      expect(() => computeNextSetState({ scores: [0, 0] })).toThrowError(
        "the gameState should contain an array of scores for both players"
      );
    });
    it("should throw an exception when receiving wrong scores", () => {
      const errorMessage = "the only valid set scores are 0,1,2,3,4,5,6";
      expect(() =>
        computeNextSetState({ gameState: { scores: [0, 0] }, scores: [10, 15] })
      ).toThrowError(errorMessage);
      expect(() =>
        computeNextSetState({ gameState: { scores: [0, 0] }, scores: [-1, 1] })
      ).toThrowError(errorMessage);
      expect(() =>
        computeNextSetState({ gameState: { scores: [0, 0] }, scores: [0, "1"] })
      ).toThrowError(errorMessage);
      expect(() =>
        computeNextSetState({
          gameState: { scores: [0, 0] },
          scores: [1, 1.42]
        })
      ).toThrowError(errorMessage);
      expect(() =>
        computeNextSetState({ gameState: { scores: [0, 0] }, scores: [7, 6] })
      ).toThrowError(errorMessage);
    });
    it("should not accepted weird scores", () => {
      const errorMessage = "Wrong scores. A player should have won the set.";
      expect(() =>
        computeNextSetState(
          { gameState: { scores: [0, 0] }, scores: [4, 6] },
          0
        )
      ).toThrowError(errorMessage);
    });
    it("should throw an exception when neither player 0 nor player 1 scored a point", () => {
      const errorMessage =
        "the player who scores the point should either be 0 or 1.";
      expect(() =>
        computeNextSetState({ gameState: { scores: [0, 0] }, scores: [0, 0] })
      ).toThrowError(errorMessage);
      expect(() =>
        computeNextSetState(
          { gameState: { scores: [0, 0] }, scores: [0, 0] },
          -1
        )
      ).toThrowError(errorMessage);
      expect(() =>
        computeNextSetState(
          { gameState: { scores: [0, 0] }, scores: [0, 0] },
          2
        )
      ).toThrowError(errorMessage);
      expect(() =>
        computeNextSetState(
          { gameState: { scores: [0, 0] }, scores: [0, 0] },
          42
        )
      ).toThrowError(errorMessage);
    });
  });
});
