var express = require('express');
var bodyParser  = require('body-parser');
var app = express();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
      cb(null, fields[0].Application+'.csv')
    },
  })

const upload = multer({ storage: storage });
const fs = require('fs');

const { spawn } = require('child_process');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


var fields = [
    { Application : 'Diabetes' },
    { name: 'Pregnancies', label: 'Pregnancies', type: 'text' },
    { name: 'Glucose', label: 'Glucose', type: 'text' },
    { name: 'BloodPressure', label: 'BloodPressure', type: 'text' },
    { name: 'SkinThickness', label: 'SkinThickness', type: 'text' },
    { name: 'Insulin', label: 'Insulin', type: 'text' },
    { name: 'BMI', label: 'BMI', type: 'text' },
    { name: 'DiabetesPedigreeFunction', label: 'BloodPresDiabetesPedigreeFunctionsure', type: 'text' },
    { name: 'Age', label: 'Age', type: 'text' }

];

app.get('/', function(req,res){
    
    res.render('index', {fields});
})

app.post('/', upload.single('file'), function(req,res){
    var Application = 'diabetes'
    if (req.file && req.file.path){
        file_path = req.file.path
        console.log("File uploaded")
        var buffer = fs.readFileSync(req.file.path);
    }
    else {
        file_path = ''
        console.log("No file uploaded")
    }
    const pythonProcess = spawn('python3', ['python_scripts/predict.py', Application, JSON.stringify(req.body), file_path]);
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
    console.log(req.body);

    res.render('index', {fields});
})

app.post('/upload', upload.single('file'), function(req,res){
    console.log(req.file);
    console.log(req.file.path)
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
