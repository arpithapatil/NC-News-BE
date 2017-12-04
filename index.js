const app = require('./server'); 
const PORT = require('./config').PORT[process.env.NODE_ENV]; 


app.listen(PORT, (err) => {
  if (err) return console.log(err);
  console.log(`app listening on port ${PORT}...` );
});