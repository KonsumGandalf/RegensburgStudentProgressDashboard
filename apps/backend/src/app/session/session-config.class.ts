import { INestApplication } from '@nestjs/common';
import session from 'express-session';
import passport from 'passport';

export const registerSession = (app: INestApplication, secret: string) => {
    app.use(
        session({
            secret: secret,
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 3600000,
            },
        })
    );

    app.use(passport.initialize());
    app.use(passport.session());
};
