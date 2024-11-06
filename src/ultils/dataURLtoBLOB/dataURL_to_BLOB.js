// Hàm chuyển đổi Data URL thành Blob
export const dataURLtoBlob = (dataURL) => {
    const [header, data] = dataURL.split(',');
    const mime = header.match(/:(.*?);/)[1];
    const binary = atob(data);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: mime });
};

export function base64ToBlob(base64) {
    // Tách mimeType từ tiền tố của chuỗi Base64
    const [prefix, base64Data] = base64.split(',');
    const mimeType = prefix.match(/:(.*?);/)[1]; // Lấy mimeType từ tiền tố

    const byteCharacters = atob(base64Data); // Giải mã phần dữ liệu sau dấu ","
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
}
