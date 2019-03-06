const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/vidjot-dev',{
  useMongoClient: true
})
.then(()=>console.log("mongodb connected...."))
.catch(err => console.log(err));

require('./models/Idea');
const Idea = mongoose.model('ideas');

app.use(function(req, res, next){
  req.name = 'Akash Gayakwad';
  next();
});

app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({extende: false}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  const title = 'welcome!';
  res.render("index",{title:title});
});

app.get('/about', (req, res) => {
  res.render("about");
});

app.get('/ideas/add', (req, res) => {
  res.render("ideas/add");
});

app.post('/ideas', (req, res) => {
  let errors = [];
  if(!req.body.title){
    errors.push({text:'Please add a title'});
  }
  if(!req.body.details){
    errors.push({text:'Please add some details'});
  }
  if(errors.length > 0){
    res.render('ideas/add',{
      errors: errors,
      title: req.body.title,
      details: req.body.details
    })
  }
  else{
      const newUser = {
        title: req.body.title,
        details: req.body.details
      }
      new Idea(newUser)
      .save()
      .then(idea =>{
        res.redirect('/ideas');
      })
    }
});


const port = 5000;

app.listen(port, () =>{
  console.log(`Server started on port ${port}`);
});
