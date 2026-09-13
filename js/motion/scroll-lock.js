/**
 * Scroll lock shared by the menu sheet and the dossier modal.
 *
 * Two things have to stop, not one: the document (via `html.is-locked`) and
 * Lenis, which keeps its own scroll offset and would otherwise keep animating
 * behind the overlay and snap the page when it closes. The pixel position is
 * captured on lock and restored on unlock, because flipping `overflow` back to
 * visible makes the browser forget where the user was.
 *
 * Locks are reference-counted: opening a modal from inside the open menu sheet
 * must not unlock the page when only the modal closes.
 */

import { getLenis } from "./smooth-scroll.js";

let depth = 0;
let savedScrollY = 0;

export const lockScroll = () => {
  depth += 1;
  if (depth > 1) return;
  savedScrollY = window.scrollY;
  getLenis()?.stop();
  document.documentElement.classList.add("is-locked");
};

export const unlockScroll = () => {
  if (depth === 0) return;
  depth -= 1;
  if (depth > 0) return;
  document.documentElement.classList.remove("is-locked");
  window.scrollTo(0, savedScrollY);
  getLenis()?.start();
};

/** True while any overlay holds the lock. */
export const isScrollLocked = () => depth > 0;
