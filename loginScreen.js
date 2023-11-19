import express, { response } from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
import fetch from 'node-fetch';

const app = express();
const port = 3000;

let token = "dGVzdEBzdW5iYXNlZGF0YS5jb206VGVzdEAxMjM=";
let status;


// User Authorization 
function auth(loginId, password, res) {

    let url = "https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp";

    const body = {
        "login_id": loginId,
        "password": password
    };

    return fetch(url, {
        method: 'post',
        body: JSON.stringify(body)

    })
        .then((response) => response.status)
        .then((data) => {
            if (data == 200) {
                res.redirect("/customerListScreen");
            }
            else {
                res.redirect("/")
            }

        })

        .catch((err) => {
            console.log(err);
            console.log("here")
        })

}

// Creating new customer
function createNewCustomer(fname, lname, street, address, city, state, email, phNum) {

    let url = "https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp";

    const body = {
        "first_name": fname,
        "last_name": lname,
        "street": street,
        "address": address,
        "city": city,
        "state": state,
        "email": email,
        "phone": phNum
    };

    return fetch(url, {
        method: 'post',
        body: JSON.stringify(body),
        headers: { Authorization: token }
    })
        .then(resp => resp.json())
        .then(data => console.log(data))
        .catch((err) => {
            console.log(err);
        })

}

// // Get Customer List
function getCustomerList() {

    let url = "https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp";

    const cmd = {
        "cmd": "get_cutomer_list"
    };

    return fetch(url, {
        method: 'get',
        headers: { Authorization: token },
        Parameters: cmd
    })
        .then(resp => resp.json())
        .then(data => data.array.forEach(user => {
            const markup = `<td>${user.first_name}</td>`;
            document.querySelector('.rows').insertAdjacentElement('beforeend', markup);
        }))
        .catch((err) => {
            console.log(err);
        })

}


// Delete customer
function deleteCustomer(cmd, uuid) {

    let url = "https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp";

    return fetch(url, {
        method: 'post',
        body: JSON.stringify(body),
        header: {
            Authorization: token
        },
        parameters: {
            cmd: cmd,
            uuid: uuid
        }
    })
        .then(resp => resp.json())
        .then(data => console.log(data))
        .catch((err) => {
            console.log(err);
        })

}


// Update Customer
// function updateCustomer(fname, lname, street, address, city, state, email, phNum) {

//     let url = "https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp";

//     const body = {
//         "first_name": fname,
//         "last_name": lname,
//         "street": street,
//         "address": address,
//         "city": city,
//         "state": state,
//         "email": email,
//         "phone": phNum
//     };

//     return fetch(url, {
//         method: 'post',
//         body: JSON.stringify(body)
//     })
// .then(resp => resp.json())
// .then(data => console.log(data))
// .catch((err) => {
//     console.log(err);
// })
// }


app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/loginScreen.html");
});

app.post("/login", (req, res) => {
    let loginId = req.body.loginid;
    let password = req.body.password;
    auth(loginId, password, res);

});

app.post("/customerDetails", (req, res) => {
    let fname = req.body.first_name;
    let lname = req.body.last_name;
    let street = req.body.street;
    let address = req.body.address;
    let city = req.body.city;
    let state = req.body.state;
    let email = req.body.email;
    let phNum = req.body.phone;
    let response = createNewCustomer(fname, lname, street, address, city, state, email, phNum);

    console.log(response);
    if (response.status == 201) {
        res.redirect("/customerListScreen");
        alert("Successfully Created");
    }
    else if (response.status == 400) {
        alert("First Name or Last name is missing");
        res.redirect("/customerDeatils");
    }
    else {
        res.redirect("/customerListScreen");
    }

});


app.get("/customerDetails", (req, res) => {
    res.sendFile(__dirname + "/customerDetails.html");
})

app.get("/customerListScreen", (req, res) => {
    getCustomerList();
    res.sendFile(__dirname + "/customerListScreen.html");
})

app.post("/customerListScreen", (req, res) => {
    cnosole.log(deleteCustomer(cmd, uuid));
    // if(deleteCustomer){
    //     res.redirect("/customerListScreen");
    // }
    // else {
    //     res.redirect("/customerListScreen");
    // }

})

// app.post("/customerDetails", (req, res) =>{

// }) 

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

