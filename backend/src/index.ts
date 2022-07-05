import logger from 'jet-logger';
import server from './server';
import mongoose  from "mongoose";

const serverStartMsg = 'Express server started on port: ',
        port = (process.env.PORT || 3000);

mongoose.connect(process.env.MONGODB_CONNECTION??"").then(() => {
    server.listen(port, () => {
        logger.info(serverStartMsg + port);
    });
}).catch((err) => {
    console.log(err)
})


