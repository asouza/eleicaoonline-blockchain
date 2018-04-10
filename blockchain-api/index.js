var restify = require('restify');
const processor = require('./sawtooth/processor');
const {VoteNHandler} = require('./sawtooth/voteHandler');
const {registerBlockchain} = require('./sawtooth/client')

processor(new VoteNHandler());

function registerVote(req, res, next) {
  const voteRequest = req.body;
  registerBlockchain(voteRequest.userNumber,voteRequest)
  res.send(200);
  next();
}

var server = restify.createServer();
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.bodyParser());

server.post('/register/vote', registerVote);

server.listen(8084, function() {
  console.log('%s listening at %s', server.name, server.url);
});
