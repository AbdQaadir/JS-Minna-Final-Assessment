const LoginForm = document.getElementById("login-form");
const SignupForm = document.getElementById("signup-form");
const SuggestForm = document.getElementById("suggest-form");
const FilterForm = document.getElementById("filter-form");
const TableBody = document.getElementById("store-table-body");

const BASE_URL = 'https://jsminnastore.herokuapp.com/';
const mobileNav = document.querySelector("#mobile-nav");

// UTILITIES
const setError = (elem, message) => {
    document.querySelector(elem).innerHTML = message;
    setTimeout(() => {
        document.querySelector(elem).innerHTML = "";
    }, 3000)
}

const saveUserToSessionStorage = (data) => {
    sessionStorage.setItem("user",  JSON.stringify(data));

    window.location.href = "/store";
}

const getUserDetails = () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    return user;
}
const populateStoreTable = (data) => {
    TableBody.innerHTML = "";

    data.forEach((item, idx) => {
        TableBody.innerHTML += `
        <tr>
            <td>${idx + 1}</td>
            <td>${item.itemName}</td>
            <td>${item.itemDescription}</td>
            <td>${item.itemCategory}</td>
            <td>${item.reason}</td>
        </tr>
        `
    })
}



// ACTIVE FUNCTIONS 
const SuggestItem = (e) => {
    e.preventDefault();
    const itemName = SuggestForm.elements['itemName'].value;
    const itemDescription = SuggestForm.elements['itemDescription'].value;
    const itemCategory = SuggestForm.elements['itemCategory'].value;
    const reason = SuggestForm.elements['reason'].value;

    const newItem = { itemName, itemDescription, itemCategory, reason };

    const { token } = getUserDetails();
    try {
        fetch(`${BASE_URL}suggest`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+ token, 
            },
            body: JSON.stringify(newItem),
        })
        .then((res) => res.json())
        .then((data) => {
            if(data.success === true){
                setError(".error", data.payload.message);
                SuggestForm.reset();
            }else{
                setError(".error", data.message);
            }
        })
        .catch((err) => console.log(err.message));
    } catch (err) {
        console.log(err.message)
    }
}

const FilterItems = (e) => {
    const { token } = getUserDetails();
    const itemCategory = FilterForm.elements['itemCategory'].value;
    try {
        fetch(`${BASE_URL}suggested/${itemCategory.toLowerCase()}`, {
            method: 'GET',
        })
        .then((res) => res.json())
        .then((data) => {
            if(data.success === true){
                populateStoreTable(data.payload.result);
            }else{
                setError(".error", data.message);
            }
        })
        .catch((err) => console.log(err.message));
    } catch (err) {
        console.log(err.message)
    }
}

const FetchAllData = () => {
    const user = getUserDetails();
    console.log(user);
    if(!user){
        window.location.href = '/login.html';
    }
    try {
        fetch(`${BASE_URL}suggested`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ user.token, 
            },
        })
        .then((res) => res.json())
        .then((data) => {
            if(data.success === true){
                populateStoreTable(data.payload.result);
            }else{
                setError(".error", data.message);
            }
        })
        .catch((err) => console.log(err.message));
    } catch (err) {
        console.log(err.message)
    }
}

const Signup = (e) => {
    e.preventDefault();
    const fullname = SignupForm.elements['fullname'].value;
    const mobileNumber = SignupForm.elements['number'].value;
    const email = SignupForm.elements['email'].value;
    const address = SignupForm.elements['address'].value;
    const gender = SignupForm.elements['gender'].value;
    const password = SignupForm.elements['password'].value;
    const data = {
        fullname,
        mobileNumber,
        email,
        address,
        gender,
        password,
    }
    try {
        fetch(`${BASE_URL}auth/signup`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then((res) => res.json())
        .then((data) => {
            if(data.success === false){
                setError(".error", data.message);
            }else{
                const { fullName, email, mobileNumber, address, gender, message, token } = data.payload;
                let newUser = { fullName, email, mobileNumber, address, gender, message, token };
                saveUserToSessionStorage(newUser);
                console.log(newUser);
            }
        })
        .catch((err) => setError(".error", data.message));
    } catch (err) {
        setError(".error", data.message);
    }
}


const Login = (e) => {
    e.preventDefault();
    const email = LoginForm.elements['email'].value;
    const password = LoginForm.elements['password'].value;
    try {
        fetch(`${BASE_URL}auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password}),
        })
        .then((res) => res.json())
        .then((data) => {
            if(data.success === false){
                setError(".error", data.message);
            }else{
                const { fullName, email, mobileNumber, address, gender, token } = data.payload;
                let newUser = { fullName, email, mobileNumber, address, gender, token };
                saveUserToSessionStorage(newUser);
                console.log(newUser);
            }
        })
        .catch((err) => console.log({err}));
    } catch (err) {
        setError(".error", err.message || "Something went wrong...");
    }
}



const ToggleNav = () => {
    mobileNav.classList.toggle("active");
}