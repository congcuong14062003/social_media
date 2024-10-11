// cropImage.js

// Hàm tạo đối tượng Image từ URL
function createImage(url) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = url;
        image.onload = () => resolve(image);
        image.onerror = (error) => reject(error);
    });
}

// Hàm xử lý cắt ảnh
export default async function processCroppedImg(imageSrc, croppedAreaPixels) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
    );

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            const fileUrl = URL.createObjectURL(blob);
            resolve(fileUrl); // Trả về URL ảnh đã cắt
        }, 'image/jpeg');
    });
}
