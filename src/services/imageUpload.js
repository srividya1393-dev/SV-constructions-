const MAX_IMAGES = 10;
const MAX_FILE_SIZE = 12 * 1024 * 1024;
const MAX_DIMENSION = 1280;

// This browser adapter is the future backend integration point. Replace the
// returned data URLs with hosted image URLs from your storage API when connected.
export async function imageFilesToDataUrls(fileList) {
  const files = Array.from(fileList);
  if (files.length > MAX_IMAGES) throw new Error(`Upload up to ${MAX_IMAGES} images per project.`);

  for (const file of files) {
    if (!file.type.startsWith('image/')) throw new Error('Only image files can be uploaded.');
    if (file.size > MAX_FILE_SIZE) throw new Error('Each image must be smaller than 12 MB.');
  }

  return Promise.all(files.map(compressImage));
}

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const source = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      const scale = Math.min(1, MAX_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext('2d');
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(source);
      resolve(canvas.toDataURL('image/jpeg', 0.72));
    };

    image.onerror = () => {
      URL.revokeObjectURL(source);
      reject(new Error(`Could not read ${file.name}.`));
    };

    image.src = source;
  });
}
