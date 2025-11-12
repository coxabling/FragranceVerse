
// utils/imageUtils.ts

export const fileToBase64Parts = (file: File): Promise<{ base64Data: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            // e.g., "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..."
            const parts = result.split(',');
            if (parts.length !== 2) {
                return reject(new Error("Invalid data URL format"));
            }
            const mimeTypePart = parts[0].split(':')[1];
            if (!mimeTypePart) {
                return reject(new Error("Could not determine MIME type from data URL"));
            }
            const mimeType = mimeTypePart.split(';')[0];
            const base64Data = parts[1];
            resolve({ base64Data, mimeType });
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};
