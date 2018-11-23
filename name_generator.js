const nodemailer = require('nodemailer');

let secret_santa_list = {
    "Latrell" : "freemanlatrell@gmail.com",
    "Jessica": "adamsjessica27407@gmail.com",
    "Jerohn": "jgilgilliam@gmail.com",
    "Melissa": "mdavis0426@gmail.com",
    "Sandra": "sadams562823@gmail.com",
    "Lee": "labs299@suddenlink.net"

};


let significant_others = {
    "Latrell": "Jessica",
    "Jessica": "Latrell",
    "Jerohn": "Melissa",
    "Melissa": "Jerohn",
    "Sandra": "Lee",
    "Lee": "Sandra"
};

let numbers = [0,1,2,3,4,5];
let significant_other_matches = {};
let final_list = {};

function draw_names() {
    while (true) {
        let names = Object.keys(secret_santa_list);
        let reshuffle = 0;
        final_list = {};
        numbers = numbers.sort(function (a, b) {
            return 0.5 - Math.random()
        });
        for (let i = 0; i < names.length; i++) {
            let selected_name = names[i];
            let secret_santa = names[numbers[i]];
            if (selected_name === secret_santa) {
                reshuffle++;
                console.log('Trying again...');
            } else {
                final_list[selected_name] = secret_santa
            }
        }

        if (reshuffle === 0) {

            for (let name in final_list){
                if (final_list[name] === significant_others[name]){
                    significant_other_matches[name] = final_list[name];
                    delete final_list[name];
                }
            }

            let index = 0;
            let new_numbers = [];
            //Create new numbers list to match significant others list
            for (let name in significant_other_matches) {
                new_numbers.push(index);
                index ++;
            }

            if (Object.keys(significant_other_matches).length > 0) {
                if (Object.keys(significant_other_matches).length === 1) {
                    draw_names();
                } else if (Object.keys(significant_other_matches).length === 2) { //Let's verify that 2 significant others don't have each other because it would be pointless to shuffle those
                    let names = Object.keys(significant_other_matches);
                    if ((significant_others[names[0]] === names[1]) &&  (significant_others[names[1]] === names[0])) {
                        draw_names();
                    }
                } else if (Object.keys(significant_other_matches).length > 1) {
                    shuffle_sig_other_list(significant_other_matches, new_numbers);
                    verify_final_list(final_list);
                    console.log("Final List after reshuffle...");
                    console.log(final_list);
                    break;
                }
            } else {
                verify_final_list(final_list);
                console.log("Final List...");
                console.log(final_list);
                break;
            }

        }
    }
}


function shuffle_sig_other_list(significant_other_matches, new_numbers) {
    while (true) {
        let names = Object.keys(significant_other_matches);
        let reshuffle = 0;
        let second_final_list = {};
        new_numbers = new_numbers.sort(function (a, b) {
            return 0.5 - Math.random()
        });
        for (let i = 0; i < names.length; i++) {
            let selected_name = names[i];
            let secret_santa = names[new_numbers[i]];
            if (selected_name === secret_santa) {
                reshuffle++;
                console.log('Trying again 2...');
            } else {
                second_final_list[selected_name] = secret_santa
            }
        }

        if (reshuffle === 0) {
            final_list = Object.assign(final_list, second_final_list);
            break;
        }
    }
}

function verify_final_list(final_list) {
    //Verify Dupes
    let keys = Object.keys(final_list);
    let dupe = false;

    for(let i=0;i<keys.length;i++){
        for(let j=i+1;j<keys.length;j++){
            if(final_list[keys[i]] === final_list[keys[j]]){
                dupe = true;
                break;
            }
        }
        if(dupe){
            console.log("dupe value is there..");
            console.log(final_list);
            draw_names();
        }
    }

    //Verify Significant Others one last time
    for (let name in final_list){
        if (final_list[name] === significant_others[name]){
            draw_names()
        }
    }
}
draw_names();

const email_address = process.env.EMAIL_ADDRESS;
const email_password = process.env.EMAIL_PASSWORD;


let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: email_address,
        pass: email_password
    }
});

for (let names in final_list) {

    let subject = 'Santa has selected you to be the secret santa for... ';
    let test_subject = 'TESTING...This is not your real secret santa';

    let mailOptions = {
        from: email_address,
        to: secret_santa_list[names],
        subject: subject,
        html: '<p><b>Santa has selected you to be the secret santa for: ' + final_list[names].toUpperCase() + '</b></p>' +
        '<p><br/><img src="https://media.tenor.com/images/8ce1a7e7fea86b7096b77e514ffae8b1/tenor.gif"/></p>',
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}