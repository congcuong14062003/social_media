import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: 'dow4cb7ab',
    api_key: '739713275211623',
    api_secret: 'u06g118_eqDYbCTQ4RH5j7xovts'
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
