import { createToken, decodeRefreshToken, deleteToken } from "../../controllers/Token/token.controller";
import Authentication from "../../middleware/authentication.js";

const TokenRouter = (app) => {
    app.delete('/delete', Authentication, deleteToken);
    app.post('/create', createToken);
    app.post('/decode-refresh-token', decodeRefreshToken);
    return app;
}
export default TokenRouter;