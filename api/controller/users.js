const db = require('../models/database').Pool
const sha256 = require('js-sha256');
const jwt = require('jsonwebtoken');
const multer = require('multer')
const mkdirp = require('mkdirp');
const fs = require('fs')
const fileExt = {
	'C': '.c',
	'C++': '.cpp'
}
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		var idUser = req.headers.authorization
		mkdirp(`uploaded/${idUser}`).then(made => {
			cb(null, `uploaded/${idUser}`)
		})
	},
	filename: function (req, file, cb) {
		var idProb = req.params.id
		var time = req.body.time
		var fileLang = req.body.fileLang
		cb(null, `${idProb}_${time}${fileExt[fileLang]}`)
	}
})
const multerConfig = multer({ storage: storage })

async function login(req,res){
    var hash = sha256.create();
	var username = req.body.username;
	var password = req.body.password;
	hash.update(password);
	console.log(username + ' Sign in at' + Date(Date.now()));
	let sql = 'select * from User where username = "' + username + '"'
	var result = await new Promise((resolve, reject) => {
		db.query(sql, (err, result) => {
			if (err) reject(err)
			resolve(result[0])
		})
	})
	if (!result) res.status(401).send('Username not found!!')
	else if (result.password != hash.hex()) res.status(401).send('Password incorrect!!')
	else {
		var data = { username: result.username, id: result.idUser, sname: result.sname, state: result.state }
		let token = jwt.sign(data, process.env.SECRET_KEY, {
			algorithm: "RS256",
			expiresIn: '3h'
		})
		const timeStamp = Math.floor(Date.now() / 1000)
		const sql = `insert into session (expires,idUser,token) values ?`
		var values = [
			[(timeStamp + 10800), data.id, token],
		]
		db.query(sql, [values], (err) => err ? console.log(err) :
			res.status(200).json(token))
	}
}

function logout(req,res) {
    const username = req.headers.authorization
	var sql = "delete from session where idUser = ?"
	db.query(sql, [username], (err) => err && console.log(err))
	res.status(200).send('')
}

function register(req,res) {
    var username = req.body.username;
	var password = req.body.password;
	var sname = req.body.sname;
	let sql = 'select * from User where username = ?'
	db.query(sql, [username], (err, result) => {
		if (result[0] === undefined) {
			var hash = sha256.create()
			hash.update(password)
			password = hash.hex()
			var sql = "insert into User (username, password, sname) values ?"
			var values = [
				[username, password, sname],
			]
			db.query(sql, [values], (err) => err ? console.log(err) :
				res.status(200).send(''))
		} else res.status(403).send('')
	})
}

function auth(req,res) {
    let token = req.headers.authorization
	try {
		let js = jwt.verify(token, process.env.PUBLIC_KEY, {
			algorithm: "RS256"
		})
		res.status(200).json(js)
	} catch {
		if (token) {
			var sql = "delete from session where token = ?"
			db.query(sql, [token], (err) => err && console.log(err))
		}
		res.status(401).json({})
	}
}

function getUser(req,res) {
	let sql = "SELECT sname,rating FROM User inner join Result as R on User.idUser = R.user_id " +
		"where contestmode is not null and state = 1 group by sname order by rating desc"
	db.query(sql, function (err, result) {
		if (err) res.status(400).send(err);
		res.json(result);
	});
}


function uploadFie(req,res) {
	var contest = req.query.contest
	var time = req.body.time
	var lang = req.body.fileLang
	var idProb = req.params.id
	var idUser = req.headers.authorization
	var sql = "INSERT INTO Result (time, user_id, prob_id, status,contestmode,language) VALUES ?";
	var values = [[time, idUser, idProb, 0, (contest ? contest : null), lang],];
	db.query(sql, [values], (err, result) => err && console.log(err))
	res.status(200).json({ msg: 'Upload Complete!' })
}

function viewSouceCode(req,res) {
	let idSubmit = Number(req.query.idSubmit)
	let idUser = Number(req.query.idUser)
	let idProb = Number(req.query.idProb)
	let sql = idSubmit ? `select * from Result where idResult = ${idSubmit}` :
		`select * from (select max(idResult) as latest from Result where user_id = ${idUser} and prob_id = ${idProb}) 
		as X inner join Result as R on R.idResult = X.latest`
	db.query(sql, (err, result) => {
		if (err) throw err
		var submitData = result[0]
		var fileName = `${submitData.prob_id}_${submitData.time}${fileExt[submitData.language]}`
		fs.readFile(`./uploaded/${submitData.user_id}/${fileName}`, function (err, data) {
			if (err) return res.json({ sCode: 'Error: ENOENT: no such file or directory' })
			res.json({ sCode: data.toString() })
		});
	})
}

module.exports = {
    login,
    logout,
    register,
	auth,
	getUser,
	uploadFie,
	multerConfig,
	viewSouceCode
}