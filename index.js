const express = require("express");
const app = express();
const bodyPraser = require("body-parser")
require('./models')
const clear = require('clear');


var loginControl = require('./controllers/loginController')
var signup = require('./controllers/signupController')
var task = require('./controllers/taskContorller')
var category = require('./controllers/category')

app.use(bodyPraser.json());

// signup
app.post("/studyPlanner/api/v1/signup", signup.SignupUser);

// login
app.post("/studyPlanner/api/v1/login", loginControl.loginUser);

// task 
app.post("/studyPlanner/api/v1/addTask",task.createTask);
app.post("/studyPlanner/api/v1/getTask", task.getTasks);
app.post ('/studyPlanner/api/v1/toggleTask', task.toggleTask)

app.post('/studyPlanner/api/v1/deleteTask', task.deleteTask)


//  category

app.post("/studyPlanner/api/v1/createCategory", category.createCategory)
app.post("/studyPlanner/api/v1/getCategorys", category.getCategorys)
app.post("/studyPlanner/api/v1/deleteCategories", category.deleteCategory)








app.get("/serverStatusCheck", (req, res) => {
    try { res.status(200).json({ message: 'Running' }); } catch (e) {
        res.status(400).json({ message: e })
    }
});

app.listen(5000, () => {
    console.log("server started on port 5000")
})

clear();