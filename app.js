const app = require('express')();
const http = require('http').Server(app);
var bodyParser = require('body-parser')
app.use(bodyParser.json())
const PORT = process.env.PORT || 3000; //normaal is het port 3000 maar voor heroku een extratje
const io = require("socket.io")(http, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
 var connectioncount = 0; 
 //de root, waar niks in zit.
app.get('/', (req, res) => {
   res.send('Notify server')
});
//momenteel verbonden clients.
app.get('/stats', function(request, response){
  response.send( connectioncount+" users verbonden" );
});
//notificatie functie. Hier komt de notificatie in JSON binnen.
//en versturen we het naar clients.
app.post('/notify', function(request, response){
    notifierdata = [request.body.text] //data op een rijtje zetten.
    io.emit('notify', notifierdata); //wegsturen richting de clients die hap.
    response.send('OK!');    //oke alles goed!
  });
//connectie event!
io.on('connection', (socket) => {
    //we tellen de aantal clients die nu verbonden zijn.
    connectioncount = socket.client.conn.server.clientsCount;
    //disconnect event!
    socket.on('disconnect', () => {
    //we tellen de aantal clients die nu verbonden zijn.
    connectioncount = socket.client.conn.server.clientsCount;
    });
  });
  //lets get started!!!
http.listen(PORT, () => {
  console.log('listening on *:'+PORT);
});
