var express = require('express');
var bodyParser  = require('body-parser');
var app = express();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');

const { spawn } = require('child_process');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');


const fields = [
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

app.post('/', function(req,res){
    const pythonProcess = spawn('python3', ['python_scripts/predict.py','diabetes', JSON.stringify(req.body), '']);
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