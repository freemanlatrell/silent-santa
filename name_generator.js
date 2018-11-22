const nodemailer = require('nodemailer');

let secret_santa_list = {
    "Latrell" : "freemanlatrell@gmail.com",
    "Jessica": "adamsjessica27407@gmail.com",
    "Jaden": "jlfwedding@gmail.com"
};

let numbers = [0,1,2];
var final_list = {};
while (true) {
    let names = Object.keys(secret_santa_list);
    let reshuffle = 0;
    final_list = {};
    numbers = numbers.sort(function(a, b){return 0.5 - Math.random()});
    for (let i = 0; i < names.length; i++) {
        let selected_name = names[i];
        let secret_santa = names[numbers[i]];
        if (selected_name === secret_santa) {
            reshuffle ++;
            console.log('Trying again...');
        } else {
            final_list[selected_name] = secret_santa
        }
    }

    if (reshuffle === 0) {
        console.log(final_list);
        break;
    }
}


const EMAIL_ADD = '';
const EMAIL_PASS = '';


let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_ADD,
        pass: EMAIL_PASS
    }
});

for (let names in final_list) {

    let mailOptions = {
        from: EMAIL_ADD,
        to: secret_santa_list[names],
        subject: 'And your secret santa is...',
        text: final_list[names]
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}