/**
 * 
 */

const app = require('../server/app');

const port = process.env.NODE_SERVER_PORT || 10000;

app.set('port', port);
app.listen(port, () => {
    console.log(`listen in ${port}`);
});