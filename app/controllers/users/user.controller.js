import Users from "../../models/users/user.model";
import UploadCloudinary from "../../../configs/cloud/cloudinary.config";
// Chú ý: không sử dụng từ khóa "async" trực tiếp trước từ khóa "export"
export const userLogin = async (req, res) => {
    try {

        // Xử lý kết quả ở đây, ví dụ trả về response JSON
        if (!req.body.phone_number || !req.body.password) {
            res.status(401).json({ success: false, message: "Please fill infomation" });
        } else {
            const result = await Users.checkLogin({
                phone_number: req.body.phone_number,
                password: req.body.password
            });
            if (result) {
                console.log(result["id"]);
                res.status(200).json({ success: true, data: {id:result["id"],name:result["name"] }});

            } else {
                res.status(401).json({ success: false, message: "Phone number or password is incorrect" });
            }
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Lỗi server." });
    }
};


export const userSignup = async (req, res) => {
    try {
        if (!req.body.phone_number || !req.body.name || !req.body.address || !req.body.password) {
            res.status(401).json({ success: false, message: "Please fill all infomation" });
        } else {
            if (req.body.phone_number) {
                const checkPhoneNumber = await Users.checkPhoneNumber(req.body.phone_number);
                if (checkPhoneNumber) {
                    res.status(400).json({ success: false, message: "Phone number is already used by another account" });
                }
                else {
                    await Users.signUpAction({
                        name: req.body.name,
                        phone_number: req.body.phone_number,
                        address: req.body.address,
                        password: req.body.password,
                        avatar_thumbnail: "https://cdn-icons-png.flaticon.com/512/186/186313.png",
                    });
                    res.status(200).json({ success: true, message: "Đăng ký thành công" });
                }
            }
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Lỗi server." });
    }
};



export const getUserByID = async (req, res) => {
    try {
        const infoUser = await Users.findUserByID(req.params.id);

        if (infoUser) {
            res.status(200).json({ success: true, data: infoUser });
        } else {

            res.status(400).json({ success: false, data: "Không tìm thấy người dùng nào phù hợp" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Lỗi server." });
    }
};





export const postUpdateUserInfo = async (req, res) => {
    try {
        const updateInfo = await Users.updateUserByID({
            name: req.body.name,
            phone_number: req.body.phone_number,
            address: req.body.address,
            password: req.body.password,
            id: req.body.id,
        });

        console.log(req.file);

        if (updateInfo) {
            res.status(200).json({ success: true, message: "Cập nhật thành công" });
        } else {
            res.status(400).json({ success: false, message: "Lỗi bất định! Thông tin chưa được cập nhật" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Lỗi server." });
    }
};




export async function updateAvatar(req, res) {
    const dataFile = req.file;
    const id = req.params.id_user;

    try {
        if (dataFile && id) {
            const dataUploadCloud = await UploadCloudinary(dataFile);
            const dataUploadURL = dataUploadCloud.url;
            const media = await Users.updateUserAvatarByID({ dataUploadURL, id });
            if (media) {
                res.status(200).json({ success: true, message: "Thành công đăng avatar" });
            }
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}




