import * as redis from 'redis';
import { Server } from 'socket.io';
import { createServer } from 'http';

require('dotenv').config()


const redisClient = redis.createClient()
const httpServer = createServer();
const io = new Server(httpServer, {
        cors: {
        origin: '*',
    }
});


httpServer.listen(4000);

const init = async () => {
    redisClient.connect();
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
}



init();