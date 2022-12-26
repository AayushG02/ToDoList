const express = require('express');
const bodyParser = require('body-parser');
const app = express();

var items = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'))

app.get('/', (req, res) => {
    var today = new Date();
    var options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    };
    var date = today.toLocaleDateString('en-US',options);
    res.render('list', {kindOfDay: date, newListItems: items});
});

app.post('/', (req, res) => {
    var newitem = req.body.newItem;
    items.push(newitem)
    res.redirect('/')
});
app.listen(3000, () => {
    console.log('Server running on port 3000.');
}); 