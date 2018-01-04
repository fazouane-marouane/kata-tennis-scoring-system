export function assert(expression, message) {
  if (!expression) {
    throw new Error(message);
  }
}
