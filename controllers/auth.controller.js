const fs = require('fs')
const appLevelConstant = require("../constant");

async function handleUserSignUp(req, res) {
    const user = {
        name: req.body.name,
        title: req.body.title,
        username: req.body.username,
        password: req.body.password,
        role: req.body.role,
        companyName: req.body.companyName,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        memorableWord: req.body.memorableWord,
    };
    if (!user.name || !user.title || !user.username || !user.password || !user.role ||
        !user.companyName || !user.address || !user.phoneNumber || !user.memorableWord) return res.status(400).json({ message: appLevelConstant.INVALID_REQUEST_OBJECT });

    fs.readFile("./data.json", "utf8", async (err, jsonString) => {
        if (err) {
            console.log("Error reading file from disk:", err);
            return;
        }
        try {
            const existingData = JSON.parse(jsonString);
            const result = await checkUsername(existingData, user.username);
            if(result)  return res.status(200).json({ message: appLevelConstant.USERNAME_ALREADY_EXISTS });
            existingData.push(user);
            const updatedData = JSON.stringify(existingData);
            fs.writeFile('./data.json', updatedData, err => {
                if (err) {
                    console.log('Error writing file', err)
                } else {
                    return res.status(200).json({ message: appLevelConstant.DATA_ADDED_SUCCESFULLY, data: user });
                }
            })
        } catch (err) {
            console.log("Error parsing JSON string:", err);
        }
    });
}

async function handleUserSignIn(req, res) {
    const {username, password} = req.query;
    if (!username || !password) return res.status(400).json({ message: appLevelConstant.INVALID_REQUEST_OBJECT });
    fs.readFile("./data.json", "utf8", async (err, jsonString) => {
        if (err) {
            console.log("Error reading file from disk:", err);
            return;
        }
        try {
            const userData = JSON.parse(jsonString);
            const result = await checkUsernamePassword(userData, username, password);
            if(!result) return res.status(400).json({ message: appLevelConstant.INVALID_CREDENTIALS });
            return res.status(200).json({ message: appLevelConstant.LOGGED_IN_SUCCESS, data: result });
        } catch (err) {
            console.log("Error parsing JSON string:", err);
        }
    });
}

// To Check Username and Password
async function checkUsernamePassword(data, username, password) {
    const result = await data.find(element => element.username === username && element.password === password);
    return result;
}

// To Check Username Exists or Not
async function checkUsername(data, username) {
    const result = await data.find(element => element.username === username);
    return result;
}

// return res.status(200).json({ message: appLevelConstant.LOGGED_IN_SUCCESS, data: element });

module.exports = {
    handleUserSignUp,
    handleUserSignIn
}