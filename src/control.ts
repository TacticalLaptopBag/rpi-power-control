import { Express, Request, Response } from "express";
import { Gpio } from "onoff";
import { delay } from "./delay";
import { isLoggedIn } from "./login";

function postOn(request: Request, response: Response, output: Gpio) {
    if(!isLoggedIn(request)) {
        response.status(401).send('Unauthorized');
        return;
    }

    console.log('Powering server ON');
    output.writeSync(1);
    delay(1000).then(() => {
        output.writeSync(0);
        response.send();
        console.log('Powered on');
    });
}

function postOff(request: Request, response: Response, output: Gpio) {
    if(!isLoggedIn(request)) {
        response.status(401).send('Unauthorized');
        return;
    }

    console.log('Powering server OFF');
    output.writeSync(1);
    delay(6000).then(() => {
        output.writeSync(0);
        response.send();
        console.log('Powered off');
    });
}

function postRestart(request: Request, response: Response, output: Gpio) {
    if(!isLoggedIn(request)) {
        response.status(401).send('Unauthorized');
        return;
    }

    console.log('Forcefully restarting server');
    output.writeSync(1);
    delay(6000).then(() => {
        output.writeSync(0);
        console.log('Server off...');
        delay(3000).then(() => {
            output.writeSync(1);
            delay(1000).then(() => {
                output.writeSync(0);
                response.send();
                console.log('Server restarted');
            });
        });
    });
}

export function setupControl(app: Express) {
    const ledPin = Number(process.env.LED_PIN);
    if(isNaN(ledPin) || ledPin === undefined)
        throw 'LED_PIN is undefined!';

    const output = new Gpio(ledPin, 'out');
    output.writeSync(0);

    app.post('/api/control/on', (request, response) => postOn(request, response, output));
    app.post('/api/control/off', (request, response) => postOff(request, response, output));
    app.post('/api/control/restart', (request, response) => postRestart(request, response, output));
}
