import "dotenv/config";
import { app } from './app'
import { runDb } from './repositories/db';

const port = process.env.PORT || 7777

const startServer = async () => {
    await runDb()
    return app.listen(port, () => {
        console.log(`App listening on port ${port}`)
    })
}

startServer()