const mailer = require('node-mailer');

let secret_santa_list = {
    "Latrell" : "freemanlatrell@gmail.com",
    "Jessica": "adamsjessica27407@gmail.com",
    "Jaden": "jlfwedding@gmail.com"
};


function random(low, high, exclude_list, exclude_yourself) {

    let list = [];
    for (let i = low; i <= high; i++) {
        list.push(i);
    }

    while (list.length > 0) {
        let random_num = items[Math.floor(Math.random()*items.length)];
    }

    let num = Math.floor(Math.random() * (high - low + 1) + low);
    let in_exclude_list = 0;
    if (exclude_list.length > 0) {
        for (let n in exclude_list) {
            if (num === Number(n)) {
                in_exclude_list++;
            }
        }
    }

    if (num === exclude_yourself) {
        in_exclude_list++;
    }


    //If generated number is in exclude list then generate a new number
    if (in_exclude_list > 0) {
        random(low, high, exclude_list, exclude_yourself)
    } else {
        return num;
    }
}

let names = Object.keys(secret_santa_list);

let selected = [];

for (let i = 0; i < names.length; i++) {

    let temp_name_list = Array.from(names);

    //Remove yourself from temp list
    temp_name_list.splice( temp_name_list.indexOf(names[i]), 1 );

    //Remove selected names from temp list
    for (let i = 0; i < selected.length; i++) {
        temp_name_list.splice( temp_name_list.indexOf(selected[i]), 1 );
    }

    //Select random name from list
    let random_name = temp_name_list[Math.floor(Math.random()*temp_name_list.length)];
    selected.push(random_name);

    console.log(random_name)
    //let num = random(0, names.length - 1, my_santa, i);
    //my_santa.push(num);
    //console.log(names[i] + "'s secret santa is " + names[my_santa])
}

/*new mailer.Mail({
    from: 'noreply@domain.com',
    to: 'rodolphe@domain.com',
    subject: 'My Subject',
    body: 'My body',
    callback: function(err, data){
        console.log(err);
        console.log(data);
    }
});*/