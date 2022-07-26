const User = require("../models/user");

function isStrongPassword(password) {
    var passRegEx = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/;
    
    if (passRegEx.test(password)) return [true];

    errorMessage = `
        The password is not strong enough.
        It should have : 
        <ul>
        <li> 8 to 15 characters </li>
        <li> At least one lowercase letter </li>
        <li> At least one uppercase letter </li>
        <li> At least one numeric digit </li>
        <li> At least one special character </li>
        </ul>
        `;
    return [false, errorMessage];
}

async function doesUsernameExists(username) {
    const res = await User.exists({
        username: username
    })
    if (res) return [false, 'The username is already taken. '];
    return [true];
}

module.exports = {
    isStrongPassword,
    doesUsernameExists
}