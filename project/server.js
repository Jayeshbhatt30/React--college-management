const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
var crypto = require("crypto");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "database1"
});

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/users", (req, res) => {
  try {
    con.query("select * from Employee where status = ?", true, (err, data) => {
      if (err) console.log(err.message);
      else {
        Object.keys(data).map(el => {
          let decipher = crypto.createDecipher("aes-128-cbc", "mypassword");
          decrypted =
            decipher.update(data[el].userPasswd, "hex", "utf8") +
            decipher.final("utf8");
          data[el].userPasswd = decrypted;
        });

        res.send(JSON.stringify(data));
      }
    });
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

app.get("/departments", (req, res) => {
  try {
    con.query(
      "select * from Department where status = ?",
      true,
      (err, data) => {
        if (err) console.log(err.message);
        else res.send(JSON.stringify(data));
      }
    );
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

app.get("/departments/dept_name", (req, res) => {
  try {
    con.query(
      "select distinct dept_name,dept_id from Department where status = ?",
      true,
      (err, data) => {
        if (err) console.log(err.message);
        else res.send(JSON.stringify(data));
      }
    );
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

app.post("/departments/update", function(req, res) {
  var data = req.body.data.id;

  con.query(
    "update department set status=?  where dept_id=?",
    [false, data],
    (error, results) => {
      if (error) return console.error(error.message);

      console.log("Deleted Row(s):", results.affectedRows);
    }
  );
  console.log(data);
});
app.post("/users/update", function(req, res) {
  var data = req.body.data.id;

  con.query(
    "update employee set status=?  where userId=?",
    [false, data],
    (error, results) => {
      if (error) return console.error(error.message);

      console.log("Deleted Row(s):", results.affectedRows);
    }
  );
  console.log(data);
});

app.post("/users/edit", function(req, res) {
  var data = req.body.data;
  var cipher = crypto.createCipher("aes-128-cbc", "mypassword");
  var mystr = cipher.update(data.password, "utf8", "hex");
  mystr += cipher.final("hex");
  con.query(
    "update employee set userName =?,userPasswd=?,userEmail=?,phoneNo=?,dept_id=? where userId=?",
    [data.name, mystr, data.email, parseInt(data.phone), data.dept_id, data.id],
    (error, results) => {
      if (error) return console.error(error.message);

      console.log("updated Row(s):", results.affectedRows);
    }
  );
  console.log(data);
});

app.post("/departments/edit", function(req, res) {
  var data = req.body.data;
  console.log(data);
  con.query(
    "update department set dept_name=? where dept_id=?",
    [data.dept_name, data.id],
    (error, results) => {
      if (error) return console.error(error.message);

      console.log("updated Row(s):", results.affectedRows);
    }
  );
  console.log(data);
});

app.post("/users/add", function(req, res) {
  var data = req.body.data;
  var cipher = crypto.createCipher("aes-128-cbc", "mypassword");
  var mystr = cipher.update(data.password, "utf8", "hex");
  mystr += cipher.final("hex");
  {
    con.query(
      "insert into employee( userName ,userPasswd,userEmail,phoneNo, dept_id,created_by,updated_on, updated_by, status) values (?,?,?,?,(select dept_id from department where dept_name =?),?,?,?,?)",
      [
        data.name,
        mystr,
        data.email,
        parseInt(data.phone),
        data.dept,
        data.name,
        curdate(),
        data.name,
        true
      ],
      (error, results) => {
        if (error) return console.error(error.message);

        console.log(" Row added (s):", results.affectedRows);
      }
    );
  }
});

let data;
app.post("/users/get/password", function(req, res) {
  data = req.body.data.name;
});

app.get("/users/data", (req, res) => {
  try {
    con.query(
      "select userPasswd from Employee where userEmail=?",
      data,
      (err, result) => {
        if (err) console.log(err.message);
        else res.send(JSON.stringify(result));
      }
    );
  } catch (err) {
    console.log(err.message);
    next(err);
  }
});

app.post("/users/signIn", function(req, res) {
  var cipher = crypto.createCipher("aes-128-cbc", "mypassword");
  var mystr = cipher.update(req.body.data.password, "utf8", "hex");
  mystr += cipher.final("hex");

  con.query(
    "select userEmail, userPasswd from employee where status = ?",
    true,
    (err, row, fields) => {
      if (
        row.find(element => {
          return (
            req.body.data.name === element.userEmail &&
            mystr === element.userPasswd
          );
        })
      ) {
        let data = req.body.data;
        jwt.sign(data, "secret", (err, token) => {
          res.send(
            JSON.stringify({
              token,
              success: true,
              message: "succesfully loggedIn"
            })
          );
        });
      } else {
        res.send(
          JSON.stringify({
            success: false,
            message: "you are using wrong email or password"
          })
        );
      }
    }
  );
});

app.listen(port, () => console.log(`Listening on port ${port}`));
