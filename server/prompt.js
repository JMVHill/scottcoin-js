var inquirer = require("inquirer");

console.log("Hi, welcome to ScottCoin");

var questions = [
    {
        type: "input",
        name: "yourName",
        message: "Enter your username"
    },
    {
        type: "rawlist",
        name: "recipient",
        message: "Who do you want to send money to?",
        choices: [ "Jamie", "Rob", "Chris","James" ],
        validate: function( value ) {
            var valid = value !== yourname;
            return valid || "You Can't send yourself money!";
        },
        filter: function( val ) { return val.toLowerCase(); }
    },
    {
        type: "input",
        name: "quantity",
        message: "How much do you want to send?",
        validate: function( value ) {
            var valid = !isNaN(parseFloat(value));
            return valid || "Please enter a number";
        },
        filter: Number
    },
    {
        type: "confirm",
        name: "confirm",
        message: "Confirm transaction?",
        default: "N"
    },
    {
        type: "list",
        name: "prize",
        message: "For leaving a comments, you get a freebie",
        choices: [ "cake", "fries" ],
        when: function( answers ) {
            return answers.comments !== "Nope, all good!";
        }
    }
];

inquirer.prompt( questions, function( answers ) {
    console.log("\nOrder receipt:");
    console.log( JSON.stringify(answers, null, "  ") );
});