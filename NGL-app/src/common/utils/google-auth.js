import {OAuth2Client} from "google-auth-library";
import {AppError} from "../error/error.js";


const client = new OAuth2Client();


export async function verifyGoogleToken(idToken) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_OAUTH_CLIENT_ID
        });
        return ticket.getPayload();
    } catch (err) {
        throw new AppError('invalid google token', 403);
    }
}