import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import express, { NextFunction, Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import 'express-async-errors';
import * as redis from 'redis';
import { Server } from 'socket.io';
import { createServer } from 'http';
import apiRouter from './routes/api';
import logger from 'jet-logger';
import { CustomError } from './shared/errors';
import { promisify } from 'util';

require('dotenv').config()

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(helmet());

app.use('/api', apiRouter);


app.use((err: Error | CustomError, _: Request, res: Response, __: NextFunction) => {
    logger.err(err, true);
    const status = (err instanceof CustomError ? err.HttpStatus : StatusCodes.BAD_REQUEST);
    return res.status(status).json({
        error: err.message,
    });
});


const redisClient = redis.createClient()

const redisGetAsync = promisify(redisClient.get).bind(redisClient);
redisClient.connect();



const httpServer = createServer();
const io = new Server(httpServer, {
        cors: {
        origin: '*',
    }
});


io.on('connect', async (socket) =>  {
    socket.on('updateContent', async (res) => {
        await redisClient.json.set('content', '.', res);

        let users = await redisClient.json.get('users', {
            path: '.',
        });

        if(Array.isArray(users)) {
            users = users.filter((elem) => {
                if(elem != null && (elem as any).id == socket.id) {
                    (elem as any).selection = res.selection;
                }                    
                return elem;
            })
        }
        
        await redisClient.json.set('users', '.', users);


        socket.broadcast.emit('updateContent', {...res, 'id' : socket.id });
    });

    socket.on('userConnected', async (res) => {
        let users = await redisClient.json.get('users', {
            path: '.',
        });
        
        
        if(users == null) {
            users = [];
        } 
        
        if(Array.isArray(users)) {
            users = [...users, 
                {
                    id : socket.id,
                    selection : res
                    }
                ];
        }
        await redisClient.json.set('users', '.', users);
        let content = await redisClient.json.get('content', {
            path: '.',
        });
        
        socket.broadcast.emit('userConnected', {'id' : socket.id, selection: res } );
        io.to(socket.id).emit('restoreContent', { users: users, content: content, id: socket.id } );
    })

    socket.on('disconnect', async () => {
        let users = await redisClient.json.get('users', {
            path: '.',
        });

        if(Array.isArray(users)) {
            users = users.filter((elem) => {
                if(elem != null && (elem as any).id != socket.id)
                    return elem;
            })
        }
        
        await redisClient.json.set('users', '.', users);


        socket.broadcast.emit('userDisconnected', {'id' : socket.id } ); // false
    });
});     
httpServer.listen(4000);


export default app;
