/**
 * Author : Vishal R
 * Date : 02/03/2017
 */
"use-strict"

var express = require('express')
var bodyParser = require('body-parser')
var shell = require('shelljs');

var app = express();
var router = require('express').Router()

app.use(bodyParser.json({ limit: 153791147 }));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: 153791147
}));

app.get('/', function(req, res) {
    res.send("The App is running")
})
app.get('/send-to-jatana', function(req, res) {
    shell.exec('curl -X POST -H "Content-Type: application/json" -d @./macro_ticket_data.json https://nlp.motherbot.co/dev/api/v1.0/jatana -v')
})

app.post('/payload', function(req, res) {
    console.log(req.headers)
    console.log(req.body.payload)
    if (!shell.which('git')) {
        shell.echo('Sorry, this script requires git');
        shell.exit(1);
    }

    //get data and check for repo name
    // swtich(eventname)
    //  case :'Push'
    //  run script
    //  get(branch_name)
    //  if (branch_name == desired_branch_name)
    //      cd get(repo_name)
    //  $repo_name:
    //	 pm2 killall
    //      git pull origin desired_branch_name
    //    pm2 restart all
    //      break
    // default:
    //     	break

    if (req.headers['x-github-event'] == 'push') {
        shell.cd('../vishalranjan.in/');
        if (shell.exec('git pull origin master').code !== 0) {
            shell.echo('Error: PULL failed');
            shell.exit(1);
            res.status(500).json({"message":"Error: PULL failed"});
        }
        if (shell.exec('pm2 restart vishalranjan.in').code !== 0) {
            shell.echo('Error: PM2 restart failed');
            shell.exit(1);
            res.status(500).json({"message":"Error: PM2 restart failed"});
        }
        res.status(200).json({"message":"Success"});
    } else {
        console.log(req.headers['x-github-event'] + " occured")
        res.status(200).json({"message":"Success"});
    }

});
var port = process.env.PORT || 1800

var server = app.listen(port, function() {
    console.log('WEBHOOKS Magic begins at port ', port);
});