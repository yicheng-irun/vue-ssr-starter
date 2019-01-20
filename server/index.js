/**
 * 
 */

const app = require('../server/app')({
    isDevMode: false,
});

const port = process.env.NODE_SERVER_PORT || 9000;

app.listen(port, () => {
    console.log(`listen in ${port}`);
});