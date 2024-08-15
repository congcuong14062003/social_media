import Cookies from 'js-cookie';
export default function getToken() {
    try {
        // Lấy token từ cookies
        const accessToken = Cookies.get('accessToken'); // => 'value'

        if (accessToken) {
            return accessToken;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error parsing token:', error.message);
        return null;
    }
}
