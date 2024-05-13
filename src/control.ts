import { Express, Request, Response } from "express";
import { Gpio } from "onoff";

function postOn(request: Request, response: Response, output: Gpio) {
    output.writeSync(1);
    response.send();
}

function postOff(request: Request, response: Response, output: Gpio) {
    output.writeSync(0);
    response.send();
}

export function setupControl(app: Express) {
    const ledPin = Number(process.env.LED_PIN);
    if(isNaN(ledPin) || ledPin === undefined)
        throw 'LED_PIN is undefined!';

    const output = new Gpio(ledPin, 'out');

    app.post('/api/control/on', (request, response) => postOn(request, response, output));
    app.post('/api/control/off', (request, response) => postOff(request, response, output));
}
