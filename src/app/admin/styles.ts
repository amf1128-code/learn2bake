/**
 * Shared style constants for admin pages.
 *
 * Change a value here and it updates everywhere it's used across
 * RecipeEditor, CurriculumEditor, and site-settings.
 */

// ---------------------------------------------------------------------------
// Buttons
// ---------------------------------------------------------------------------

/** Primary action button — save, create, submit */
export const btnPrimary =
  "px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50";

/** Destructive record-level button — delete recipe */
export const btnDanger =
  "px-4 py-2 bg-danger-light text-danger rounded-lg text-sm font-medium hover:bg-danger-subtle";

/** Ghost / secondary button — cancel */
export const btnGhost = "px-4 py-2 border border-border rounded-lg text-sm";

/** Inline link-style "add" button (normal size) */
export const btnLink = "text-sm text-accent hover:text-accent-dark font-medium";

/** Inline link-style "add" button (small) */
export const btnLinkXs = "text-xs text-accent hover:text-accent-dark";

/** Muted text button — edit / collapse toggles in list headers */
export const btnMuted = "text-sm text-muted hover:text-foreground";

/** Inline × remove button next to list items */
export const btnRemove = "text-danger-muted hover:text-danger text-sm";

/** Up/down reorder arrow buttons */
export const btnMove =
  "text-muted hover:text-foreground disabled:opacity-30 text-xs";

/** Floating × button overlaid on an image thumbnail */
export const btnImageRemove =
  "absolute -top-2 -right-2 bg-danger-bold text-white rounded-full w-5 h-5 text-xs flex items-center justify-center";

// ---------------------------------------------------------------------------
// Inputs
// ---------------------------------------------------------------------------

/** Standard full-width input / select / textarea (large form fields) */
export const inputBase =
  "w-full border border-border rounded-lg px-3 py-2 text-sm";

/** Full-width input that supports a disabled state */
export const inputDisabled =
  "w-full border border-border rounded-lg px-3 py-2 text-sm disabled:bg-background";

/**
 * Compact inline input — no width class so you can pair it with a layout
 * utility (flex-1, w-20, w-1/3, etc.):
 *   className={`flex-1 ${inputSm}`}
 */
export const inputSm = "border border-border rounded px-2 py-1.5 text-sm";

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

/** Standard block label above a form field */
export const labelBase = "block text-sm font-medium text-foreground mb-1";

/** Smaller label for sub-fields (timer label, duration, type) */
export const labelSm = "block text-xs text-muted mb-1";

/** Inline label (no display:block or margin — use inside flex rows) */
export const labelInline = "text-sm font-medium text-foreground";

// ---------------------------------------------------------------------------
// Layout / cards
// ---------------------------------------------------------------------------

/** Main padded content card */
export const card = "bg-surface border border-border rounded-lg p-6";

/** Content card without padding — content manages its own padding */
export const cardFlush =
  "bg-surface border border-border rounded-lg overflow-hidden";

/** Inner card for nested UI panels (timer panel, recipe option rows) */
export const cardInner = "border border-border rounded-lg p-4 bg-background";

// ---------------------------------------------------------------------------
// Status feedback (inline text)
// ---------------------------------------------------------------------------

/** "Saved" / success confirmation text */
export const statusSuccess = "text-sm text-success";

/** Error message text */
export const statusError = "text-sm text-danger";

// ---------------------------------------------------------------------------
// Step header badges (pill-shaped status indicators)
// ---------------------------------------------------------------------------

/** Timer badge */
export const badgeBlue =
  "text-xs bg-info-light text-info px-2 py-0.5 rounded";

/** Photo badge */
export const badgeGreen =
  "text-xs bg-success-light text-success px-2 py-0.5 rounded";

/** Videos badge */
export const badgePurple =
  "text-xs bg-media-light text-media px-2 py-0.5 rounded";

// ---------------------------------------------------------------------------
// Concept / tag toggle pills
// ---------------------------------------------------------------------------

/** Base classes for a large concept pill (recipe-level) */
export const pillLg =
  "px-3 py-1 rounded-full text-sm border transition-colors";

/** Base classes for a small concept pill (step-level) */
export const pillSm = "px-2 py-0.5 rounded-full text-xs border";

/** Active / selected state for concept pills */
export const pillOn = "bg-accent-light border-accent text-accent-dark";

/** Inactive / unselected state for concept pills */
export const pillOff = "bg-background border-border text-muted";

// ---------------------------------------------------------------------------
// Timer toggle (on/off chip inside step editor)
// ---------------------------------------------------------------------------

/** Base classes for the timer enable/disable toggle chip */
export const timerToggleBase = "text-xs px-3 py-1 rounded-full border";

/** Active state for the timer toggle (timer is enabled) */
export const timerToggleOn = "bg-info-light border-info-subtle text-info-dark";

// ---------------------------------------------------------------------------
// Baker's percentage
// ---------------------------------------------------------------------------

/** Base ingredient indicator button in the ingredient table */
export const bakersBase =
  "w-full text-xs font-medium text-bakers bg-bakers-light border border-bakers-subtle rounded px-1.5 py-1 hover:bg-bakers-hover text-center";

// ---------------------------------------------------------------------------
// Ingredient table
// ---------------------------------------------------------------------------

/** Column header text in the ingredients table */
export const colHeader =
  "text-xs font-medium text-muted uppercase tracking-wide";
