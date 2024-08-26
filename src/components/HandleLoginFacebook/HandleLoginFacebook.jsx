import { getAuth, signInWithPopup, FacebookAuthProvider } from "firebase/auth";
async function ShowPopupLoginWithFacebook() {
    const provider = new FacebookAuthProvider();
    provider.addScope('email');

    const auth = getAuth();
    auth.useDeviceLanguage();

    provider.setCustomParameters({
        'display': 'popup'
    });

    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("user: ", user);
        
        return {
            user_id: user.providerData[0].uid,
            user_name: user.providerData[0].displayName,
            user_email: user.providerData[0].email,
            created_at: user.metadata.createdAt,
            user_password: user.providerData[0].displayName,
            media: {
                media_type: 'avatar',
                media_link: user.providerData[0].photoURL
            },
            type_account: 'facebook'
        };
        
    } catch (error) {
        console.error('Error Code:', error.code);
        console.error('Error Message:', error.message);
        const email = error.customData?.email;
        const credential = FacebookAuthProvider.credentialFromError(error);
        console.error('Error Email:', email);
        console.error('Credential used:', credential);
        throw error;  // Throw error to be handled by the caller
    }
}

export default ShowPopupLoginWithFacebook;