const server = require('./api/server');

const port = process.env.PORT || 5345;

server.listen(PORT, ()=>{
console.log('all good on port ' + PORT)
});