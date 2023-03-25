var express = require('express');
var bodyParser  = require('body-parser');
var app = express();
const multer = require('multer');
const path = require('path');


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

const { spawnSync } = require('child_process');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


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
    const pythonProcess = spawnSync('python3', ['python_scripts/predict.py', Application, JSON.stringify(req.body), file_path]);
    console.log(pythonProcess.stdout.toString())
    // pythonProcess.stdout.on('data', (data) => {
    //     console.log(`Received data from Python script: ${data}`);
    // });

    // pythonProcess.stderr.on('data', (data) => {
    //     console.error(`Error received from Python script: ${data}`);
    // });

    // Listen for the Python process to exit
    // pythonProcess.on('close', (code) => {
    //     console.log(`Python script exited with code ${code}`);
    // });
    
    console.log(req.body);

    
    // console.log(pythonProcess.stdout.toString())
    if (req.file){
        // var result = fs.readFileSync('results/'+Application+'_result.csv');
        // res.send(result)
        res.download(pythonProcess.stdout.toString().replace(/(\r\n|\n|\r)/gm, ''));
    }
    else {
        res.render('results', {out : pythonProcess.stdout.toString()});
    }
    // res.render('index', {fields});
})

// app.post('/upload', upload.single('file'), function(req,res){
//     console.log(req.file);
//     console.log(req.file.path)
//     if (!req.file || !req.file.path) {
//         // handle error here
//         res.status(400).send('No file uploaded');
//         return;
//     }

//     var buffer = fs.readFileSync(req.file.path);
//     res.send(buffer)
// })


app.listen(3300,function(){
    console.log("Listening on port 3300");
})
