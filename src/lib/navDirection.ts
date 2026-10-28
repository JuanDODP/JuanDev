export type NavDirection = 'forward' | 'back' | 'lateral';

/**
 * Tags the next view transition so CSS can pick its animation:
 * forward/back slide for list ↔ detail, lateral cross-fades between siblings.
 * Set right before a `viewTransition` navigation (e.g. in a Link's onClick).
 */
export function setNavDirection(direction: NavDirection) {
  document.documentElement.dataset.nav = direction;
}
