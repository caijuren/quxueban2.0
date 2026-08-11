const USER_OWNED_FOLDERS = new Set(['avatars', 'certificates', 'general']);

export function isUserOwnedUpload(
  folder: string,
  filename: string,
  userId: string
): boolean {
  return USER_OWNED_FOLDERS.has(folder) && filename.startsWith(`${userId}-`);
}

export function isViewableTaskEvidence(filename: string, childIds: string[]): boolean {
  return childIds.some((childId) => filename.startsWith(`evidence-${childId}-`));
}
