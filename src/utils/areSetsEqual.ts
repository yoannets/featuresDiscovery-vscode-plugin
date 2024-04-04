export function areSetsEqual<T>(set1: Set<T>, set2: Set<T>): boolean {
  if (set1.size !== set2.size) {
    return false;
  }

  for (let item of set1) {
    if (!set2.has(item)) {
      return false;
    }
  }

  return true;
}
