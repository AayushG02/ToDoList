const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const app = express();

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/todolistDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const itemsSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your to do list!"
});
const item2 = new Item({
    name: "Hit the + button to add a new item."
});
const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

Item.insertMany(defaultItems, (err)=> {
    if(err) {
        console.log(err);
    } else {
        console.log("Inserted Items Successfully!")
    }
})

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'))

app.get('/', (req, res) => {

    res.render('list', {listTitle: "Today", newListItems: items});
});

app.post('/', (req, res) => {
    var newitem = req.body.newItem;
    items.push(newitem)
    res.redirect('/')
});
app.listen(3000, () => {
    console.log('Server running on port 3000.');
}); 