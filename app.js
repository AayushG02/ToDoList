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
const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
});

const Item = mongoose.model("Item", itemsSchema);
const List = mongoose.model("List", listSchema);

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

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'))

app.get('/', (req, res) => {
    Item.find({}, (err, foundItems)=>{
        if(foundItems.length === 0) {
            Item.insertMany(defaultItems, (err)=> {
                if(err) {
                    console.log(err);
                } else {
                    console.log("Inserted Items Successfully!")
                }
            });
            res.redirect("/");
        } else {
            res.render("list", {listTitle: "Today", newListItems: foundItems});
        }
    });
});

app.post('/', (req, res) => {
    const newitem = req.body.newItem;
    const listName = req.body.list;
    const item = new Item({
        name: newitem
    })

    if(listName === "Today") {
        item.save();
        res.redirect('/')
    } else {
        List.findOne({name: listName}, (err, foundList)=>{
            foundList.items.push(item);
            foundList.save();
            res.redirect('/' + listName);
        });
    }

});

app.get('/:customListName', (req, res)=> {
    const customlistName = req.params.customListName;
    List.findOne({name: customlistName}, (err, foundList)=> {
        if(!err) {
            if(!foundList) {
                const list = new List({
                    name: customlistName,
                    items: defaultItems
                });
                list.save();
                res.redirect('/' + customlistName);
            } else {
                res.render('list', {listTitle: foundList.name, newListItems: foundList.items});
            }
        }
    });
});
app.post('/:customListName', (req, res) => {
    const newitem = req.body.newItem;
    const item = new Item({
        name: newitem
    })
    item.save();
    res.redirect('/:customListName')
});

app.post('/delete', (req, res)=> {
    const checkedItem = req.body.deleteItem;
    console.log(checkedItem)
    Item.deleteOne({_id: checkedItem}, (err)=> {
        if(err) {
            console.log(err);
        } else {
            console.log("Item Deleted!");
        }
    });
    res.redirect('/');
})
app.listen(3000, () => {
    console.log('Server running on port 3000.');
}); 