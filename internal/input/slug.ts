const maxLength = 50;

// makeSlug will convert a string into a valid slug, according to the
// semantics of slugs used in the Airplane API. Emulates the
// same gosimple/slug-based implementation.
export const makeSlug = (s: string): string => {
  s = s.trim().toLowerCase();

  for (const [a, b] of Object.entries({
    "‒": "_", // figure dash
    "–": "_", // en dash
    "—": "_", // em dash
    "―": "_", // horizontal bar
    "&": "and",
    "@": "at",
    "%": "percent",
  })) {
    // The extra "_"'s ensure these replacements aren't attached onto adjacent
    // words. For example: 100% -> 100_percent
    s = s.replace(new RegExp(a, "g"), "_" + b + "_");
  }

  // Replace non-authorized characters
  s = s.replace(/[^a-z0-9_]/g, "_");

  // Trim leading/trailing underscores
  s = s.replace(/^_*/, "");
  s = s.replace(/_*$/, "");

  // Collapse any duplicate _'s
  s = s.replace(/_+/g, "_");

  // Trim to maxLength
  s = s.substring(0, maxLength);

  return s;
};
