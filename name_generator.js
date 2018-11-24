const nodemailer = require('nodemailer');

//Secret Santa List. TODO Move This list to Cloudant DB
let secret_santa_list = {
    "Latrell" : "freemanlatrell@gmail.com",
    "Jessica": "adamsjessica27407@gmail.com",
    "Jerohn": "jgilgilliam@gmail.com",
    "Melissa": "mdavis0416@gmail.com",
    "Sandra": "sadams562823@gmail.com",
    "Lee": "labs299@suddenlink.net"

};

// Significant others list. This list will be used to confirm none of no one is matched with their significant other
let significant_others = {
    "Latrell": "Jessica",
    "Jessica": "Latrell",
    "Jerohn": "Melissa",
    "Melissa": "Jerohn",
    "Sandra": "Lee",
    "Lee": "Sandra"
};


//Create an array of numbers to match the number of properties in the secret santa list
// These numbers will be used to shuffle and pair names to their secret santa
// Example numbers = [0,1,2,3,4,5]
let numbers = [];
let index = 0;

for (let name in secret_santa_list) {
    numbers.push(index);
    index ++;
}

// Declare object to be used to extract significant other matches. We will eventually reshuffle this list also
let significant_other_matches = {};

let final_list = {};

/**
 * This function is used to shuffle the numbers and match the names with their secret santa
 */
function draw_names() {
    while (true) {
        let names = Object.keys(secret_santa_list);
        let reshuffle = 0;
        final_list = {};

        //Shuffle numbers
        numbers = numbers.sort(function (a, b) {
            return 0.5 - Math.random()
        });

        //Loop thru names in secret santa list and pair with a secret santa
        for (let i = 0; i < names.length; i++) {
            let selected_name = names[i];
            let secret_santa = names[numbers[i]];

            //If anyone on the list is matched with themselves then we will reshuffle again
            //Else we add them to the final list
            if (selected_name === secret_santa) {
                reshuffle++;
                console.log('Trying again...');
            } else {
                final_list[selected_name] = secret_santa
            }
        }

        if (reshuffle === 0) {
            //If we made it thru successfully, now we start to check for significant other matches.
            // We don't want that. Why would we let you have your significant other as a secret santa when you have to buy them gifts anyway
            for (let name in final_list){
                if (final_list[name] === significant_others[name]){
                    significant_other_matches[name] = final_list[name];
                    delete final_list[name];
                }
            }

            //Create new numbers list to match significant others list
            let index = 0;
            let new_numbers = [];
            for (let name in significant_other_matches) {
                new_numbers.push(index);
                index ++;
            }

            if (Object.keys(significant_other_matches).length > 0) {
                if (Object.keys(significant_other_matches).length === 1) { //If there's only one significant other match, then we have nothing to shuffle. Guess we'll just start over from the beginning and try again
                    draw_names();
                } else if (Object.keys(significant_other_matches).length === 2) { //Let's verify that 2 significant others don't have each other because it would be pointless to shuffle those
                    let names = Object.keys(significant_other_matches);
                    if ((significant_others[names[0]] === names[1]) &&  (significant_others[names[1]] === names[0])) {
                        draw_names();
                    }
                } else { // Else...shuffle significant others list
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


/**
 * Shuffle Significant Others list
 * @param significant_other_matches Object container significan other matches
 * @param new_numbers Array of new numbers to shuffle
 */
function shuffle_sig_other_list(significant_other_matches, new_numbers) {
    while (true) {
        let names = Object.keys(significant_other_matches);
        let reshuffle = 0;
        let second_final_list = {};

        //Shuffle new numbers
        new_numbers = new_numbers.sort(function (a, b) {
            return 0.5 - Math.random()
        });

        //Loop thru names in significant other names and pair with a new secret santa
        for (let i = 0; i < names.length; i++) {
            let selected_name = names[i];
            let secret_santa = names[new_numbers[i]];

            //If anyone on the list is matched with themselves then we will reshuffle again
            //Else we add them to the final list
            if (selected_name === secret_santa) {
                reshuffle++;
                console.log('Trying again 2...');
            } else {
                second_final_list[selected_name] = secret_santa
            }
        }

        //If everything is successful then lets concatenate the new significant others list with the previous list
        if (reshuffle === 0) {
            final_list = Object.assign(final_list, second_final_list);
            break;
        }
    }
}

/**
 * Perform one final verification to check for duplicate secret santas and verify we don't have any more significant others paired together
 * @param final_list Object containing final list of secret santas
 */
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


/**
 * Send emails to everyone notifying them of their secret santas
 */
function send_emails () {
    const email_address = process.env.EMAIL_ADDRESS;
    const email_password = process.env.EMAIL_PASSWORD;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: email_address,
            pass: email_password
        }
    });

    // Loop thru each name in the final list and send email notification
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
}

//****************//
//STARTING POINT
//***************//
draw_names();
send_emails();