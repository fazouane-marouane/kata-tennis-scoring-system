/**
 * Utility function to enforce invariants.
 *
 * @param {*} expression The invariant that should be checked
 * @param {*} message The error message that should be thrown if the invariant is not respected
 */
export function assert(expression, message) {
  if (!expression) {
    throw new Error(message);
  }
}
