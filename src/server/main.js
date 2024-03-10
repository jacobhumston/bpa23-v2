import express from 'express';
const app = express();
let port = 80;
if (process.argv[2]) port = Number(process.argv[2]);
app.use('/', express.static('src/client/', { extensions: ['html'] }));
app.use(function (_, response) {
    response.status(404).sendFile('src/client/404.html', { root: '.' });
});
app.listen(port, () => console.log(`Server listening on port ${port}.`));
