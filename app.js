var express = require('express');
var bodyParser  = require('body-parser');
var app = express();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');

const { spawn } = require('child_process');
const pythonProcess = spawn('python', ['python_scripts/predict.py', 'arg1', 'arg2']);
pythonProcess.stdout.on('data', (data) => {
    console.log(`Received data from Python script: ${data}`);
});

pythonProcess.stderr.on('data', (data) => {
    console.error(`Error received from Python script: ${data}`);
});

// Listen for the Python process to exit
pythonProcess.on('close', (code) => {
    console.log(`Python script exited with code ${code}`);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


const fields = [
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'message', label: 'Message', type: 'textarea' }
];

app.get('/', function(req,res){
    
    res.render('index', {fields});
})

app.post('/', function(req,res){
    
    console.log(req.body);
    res.render('index', {fields});
})

app.post('/upload', upload.single('formFile'), function(req,res){
    if (!req.file || !req.file.path) {
        // handle error here
        res.status(400).send('No file uploaded');
        return;
      }

    var buffer = fs.readFileSync(req.file.path);
    res.send(buffer)
})


app.listen(3300,function(){
    console.log("Listening on port 3300");
})