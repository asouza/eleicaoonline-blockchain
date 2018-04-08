var restify = require('restify');
const processor = require('./sawtooth/processor');
const {JSONHandler} = require('./sawtooth/voteHandler');
const {submitUpdate,ellectionVotes,voterVotes} = require('./sawtooth/client')

processor(new JSONHandler());

function registerVote(req, res, next) {
  const voteRequest = req.body;
  const callback = (ok) => {
    console.log("deu certo? "+ok);
  }
  submitUpdate(voteRequest.userNumber,{action:'create',...voteRequest},callback);
  res.send(200);
  next();
}

function listVotes(req,res,next) {
  ellectionVotes(req.params.ellectioName,votes => {
      console.log(votes);
      res.send(votes);
      next();
  });
}

function listVoterVotes(req,res,next) {
  voterVotes(req.params.ellectioName,req.params.publicKey,votes => {
      res.send(votes);
      next();
  });
}

var server = restify.createServer();
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.bodyParser());

server.post('/register/vote', registerVote);
server.get('/ellection/:ellectioName/votes', listVotes);
server.get('/ellection/:ellectioName/:publicKey/votes', listVoterVotes);

server.listen(8084, function() {
  console.log('%s listening at %s', server.name, server.url);
});
