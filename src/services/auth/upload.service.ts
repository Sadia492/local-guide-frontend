export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { valid: false, error: "File must be less than 5MB" };
  }

  // Check file type
  if (!file.type.startsWith("image/")) {
    return { valid: false, error: "Please upload an image file" };
  }

  // Check file extension
  const validExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (!extension || !validExtensions.includes(extension)) {
    return {
      valid: false,
      error: "Only JPG, PNG, GIF, or WebP files are allowed",
    };
  }

  return { valid: true };
}

export function createFilePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
