import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
function signUpWithFacebook() {
    const provider = new FacebookAuthProvider();

    const auth = getAuth();
    auth.languageCode = 'it';  // Setting the language to Italian, you can change this as needed.

    // Optional: Apply the default browser preference instead of explicitly setting it.
    // auth.useDeviceLanguage();

    provider.setCustomParameters({
        'login_hint': 'user@example.com'
    });

    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = FacebookAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            console.log('Success:', user);

            // Optional: Retrieve IdP data if needed
            // const additionalUserInfo = getAdditionalUserInfo(result);

            // Handle additional tasks or route user to another part of your app
        })
        .catch((error) => {
            // Handle Errors here.
            console.error('Error Code:', error.code);
            console.error('Error Message:', error.message);
            // Optional: Handle email and credential info from the error
            const email = error.customData?.email;
            const credential = FacebookAuthProvider.credentialFromError(error);
            console.error('Error Email:', email);
            console.error('Credential used:', credential);
        });
}

export default signUpWithFacebook;
