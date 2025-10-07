// Utility functions for user management
// Following the shared component architecture for future web/mobile compatibility

/**
 * Generates a unique, memorable username from first and last name
 * Handles multi-word names with progressive pattern:
 * 1. firstinitials.firstlastname (e.g., j.a.jose)
 * 2. Add second lastname (e.g., j.a.jose.gimeno)
 * 3. Add more lastnames until exhausted
 * 4. Use full first firstname (e.g., juan.a.jose.gimeno)
 * 5. Add more first names until exhausted
 * 6. Append numbers to pattern #1 as last resort (e.g., j.a.jose2)
 *
 * @param firstName - User's first name (can be multi-word: "Juan Antonio")
 * @param lastName - User's last name (can be multi-word: "Jose Gimeno")
 * @param existingUsernames - Array of already taken usernames to check against
 * @returns A unique username in lowercase format
 *
 * @example
 * generateUsername("Juan Antonio", "Jose Gimeno", []) // returns "j.a.jose"
 * generateUsername("Juan Antonio", "Jose Gimeno", ["j.a.jose"]) // returns "j.a.jose.gimeno"
 * generateUsername("Juan Antonio", "Jose Gimeno", ["j.a.jose", "j.a.jose.gimeno"]) // returns "juan.a.jose.gimeno"
 */
export function generateUsername(
  firstName: string,
  lastName: string,
  existingUsernames: string[] = []
): string {
  // Split and normalize names
  const firstNameParts = firstName
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .map(part => part.replace(/[^a-z0-9]/g, ''))
    .filter(part => part.length > 0);

  const lastNameParts = lastName
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .map(part => part.replace(/[^a-z0-9]/g, ''))
    .filter(part => part.length > 0);

  if (firstNameParts.length === 0) {
    throw new Error('First name must contain at least one valid word');
  }

  const candidates: string[] = [];

  // If no last name, use first names only (e.g., juan.antonio)
  if (lastNameParts.length === 0) {
    if (firstNameParts.length === 1) {
      const firstName = firstNameParts[0];
      if (firstName) {
        candidates.push(firstName);
      }
    } else {
      // Multiple first names: progressively add full first names (skip initials - too short)
      for (let i = 0; i < firstNameParts.length; i++) {
        candidates.push(firstNameParts.slice(0, i + 1).join('.'));
      }
    }
  } else {
    // Normal flow with last name
    // Pattern 1: All first name initials + first last name
    // e.g., j.a.jose
    const firstInitials = firstNameParts.map(part => part[0]).join('.');
    candidates.push(`${firstInitials}.${lastNameParts[0]}`);

    // Pattern 2-N: Add additional last name parts
    // e.g., j.a.jose.gimeno, j.a.jose.gimeno.garcia
    for (let i = 1; i < lastNameParts.length; i++) {
      const lastNameSegment = lastNameParts.slice(0, i + 1).join('.');
      candidates.push(`${firstInitials}.${lastNameSegment}`);
    }

    // Pattern N+1: Use full first firstname + remaining initials + all lastnames
    // e.g., juan.a.jose.gimeno
    if (firstNameParts.length > 1) {
      const fullFirstFirst = firstNameParts[0];
      const remainingInitials = firstNameParts.slice(1).map(part => part[0]).join('.');
      const allLastNames = lastNameParts.join('.');
      candidates.push(`${fullFirstFirst}.${remainingInitials}.${allLastNames}`);
    }

    // Pattern N+2 onwards: Progressively add full first names
    // e.g., juan.antonio.jose.gimeno
    for (let i = 1; i < firstNameParts.length; i++) {
      const fullFirstNames = firstNameParts.slice(0, i + 1).join('.');
      const allLastNames = lastNameParts.join('.');
      candidates.push(`${fullFirstNames}.${allLastNames}`);
    }
  }

  // Try each candidate
  for (const candidate of candidates) {
    if (!existingUsernames.includes(candidate)) {
      return candidate;
    }
  }

  // Last resort: append numbers
  // If no last name, use all full first names (e.g., juan.antonio2)
  // If has last name, use the first pattern (e.g., j.a.jose2)
  let baseUsername: string;
  if (lastNameParts.length === 0) {
    // Use all full first names for numbering
    baseUsername = firstNameParts.join('.');
  } else {
    // Use the first pattern (initials + first lastname)
    baseUsername = candidates[0] || firstNameParts.join('.');
  }

  let counter = 2;
  let candidateUsername = `${baseUsername}${counter}`;

  while (existingUsernames.includes(candidateUsername)) {
    counter++;
    candidateUsername = `${baseUsername}${counter}`;
  }

  return candidateUsername;
}
