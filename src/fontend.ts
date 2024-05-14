import express, { Express } from "express";

export function setupFrontend(app: Express) {
    app.use(express.static('./app', {
        dotfiles: 'ignore',
        etag: false,
        extensions: ['html', 'js', 'scss', 'css'],
        maxAge: '1y',
        redirect: true,
    }));
}
