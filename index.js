const express = require("express");
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const PORT = 8001;
const authRouter = require("./routes/auth.route");

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(cors());

app.use('/auth', authRouter)

app.listen(PORT, () => {
    console.log(`Server started at PORT ${PORT}`);
});
