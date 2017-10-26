const fs = require("fs");
const path = require("path");

//file name and content for webpack watch mode;
const WATCHER_FILE_CONTENT = {
  timestamp: new Date().toLocaleString(),
  watch: true
};
const WATCHER_FILE = "watcher.json";

let file = null,
  readFileSync = null,
  filepath = path.join(__dirname, "/" + WATCHER_FILE);

//Check if watcher already exist -- exit the process if yes
if (fs.existsSync(filepath)) {
  console.log("Generation process only", "No build required");
  process.exit(0);
}

//Create the webpack watcher status file
fs.writeFile(
  WATCHER_FILE,
  JSON.stringify(WATCHER_FILE_CONTENT, null, " "),
  err => {
    if (err) {
      console.log(error);
    }
    file = fs.readFileSync(filepath);

    triggerContiniousProcess();

    console.log("File content at : " + new Date() + " is \n" + file);
    console.log("watch status generated", "Ready for webpack build ...");
  }
);

//Close the watcher if the flag changed to flase
const handleFileChange = (flag = false) => {
  if (intervalObj && !flag) {
    clearInterval(intervalObj);
    fs.unwatchFile(filepath);
    fs.unlink(filepath, function(err) {
      if (err) return console.log(err);
      console.log("file deleted successfully");
    });
    console.log("i am closed now");
  }
};

//Initiate webpack build -- Simulation in setInterval
const triggerContiniousProcess = () => {
  intervalObj = setInterval(function(argument) {
    console.log("I am a continious process");
  }, 2000);
};

//watch the watcher status file for change
const watcher = fs.watchFile(WATCHER_FILE, (event, filename) => {
  if (filename) {
    file = fs.readFileSync(filepath);
    handleFileChange(JSON.parse(file).watch);
  }
});

//Handler on process exiting manually
function exitHandler(options, err) {
  console.log("exiting process");
  if (options.cleanup) handleFileChange();
  if (err) console.log(err.stack);
}

//Remove the json when process is closed manually
process.on("exit", exitHandler.bind(null, { cleanup: true }));
