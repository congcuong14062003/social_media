import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: 'der2ygna3',
    api_key: '268779123315888',
    api_secret: 'doWpglhaxPBkH76oq2Klk7ylE6k'
});

export default async function UploadCloudinary(file) {
    try {
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({
                resource_type: 'auto',
                folder: "avatar_user_foodapp",
                overwrite: true
            }, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }).end(file.buffer);
        });
        
        return result;
    } catch (error) {
        console.error("Lỗi khi tải lên:", error);
        return error;
    }
}
