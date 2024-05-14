import { Request, Response, Express } from "express";
import { compareSync } from "bcrypt";
import { sign, verify } from "jsonwebtoken";

function postLogin(request: Request, response: Response) {
    const login = {
        username: request.get('auth_username'),
        password: request.get('auth_password'),
    };

    const username = process.env.USER_NAME;
    const password = process.env.USER_PASS;
    const secret = process.env.JWT_SECRET;
    const headerName = process.env.JWT_HEADER;
    const sessionTTL = Number(process.env.SESSION_TTL) || 300;
    if(username === undefined || password === undefined || secret === undefined || headerName === undefined) {
        console.error('USER_NAME, USER_PASS, JWT_SECRET, or JWT_HEADER is not defined!');
        response.status(500).send('Internal Server Error');
        return;
    }

    if(login.password === undefined || username !== login.username || !compareSync(login.password, password)) {
        response.status(401).send('Invalid user/password');
        return;
    }

    const encodedToken = sign({ user: username }, secret, { expiresIn: sessionTTL });
    response.set(headerName, encodedToken);
    try {
        console.log('Session TTL: ', sessionTTL);
        const token = verify(encodedToken, secret);
        response.send(token);
    } catch(e) {
        console.error(e);
        response.status(500).send('Internal Server Error');
    }
}

function getLogin(request: Request, response: Response) {
    const username = process.env.USER_NAME;
    const secret = process.env.JWT_SECRET;
    const headerName = process.env.JWT_HEADER;
    if(username === undefined || secret === undefined || headerName === undefined) {
        console.error('USER_NAME, JWT_SECRET, or JWT_HEADER is not defined!');
        response.status(500).send('Internal Server Error');
        return;
    }

    const encodedToken = request.get(headerName);
    if(encodedToken === undefined) {
        response.status(401).send('Unauthorized');
        return;
    }

    try {
        const token = verify(encodedToken, secret);
        response.send(token);
    } catch {
        response.status(401).send('Unauthorized');
    }
}

export function setupLogin(app: Express) {
    app.post('/api/login', (request, response) => postLogin(request, response));
    app.get('/api/login', (request, response) => getLogin(request, response));
}

export function isLoggedIn(request: Request): boolean {
    const username = process.env.USER_NAME;
    const secret = process.env.JWT_SECRET;
    const headerName = process.env.JWT_HEADER;
    if(username === undefined || secret === undefined || headerName === undefined) {
        console.error('USER_NAME, JWT_SECRET, or JWT_HEADER is not defined!');
        return false;
    }

    const encodedToken = request.get(headerName);
    if(encodedToken === undefined)
        return false;

    try {
        const token = verify(encodedToken, secret);
        return token !== undefined;
    } catch {
        return false;
    }
}
