const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

let dataDummy = [
	{
		id: 1,
		judul: "Buku Sakti Pemrogaman Web: HTML, CSS, PHP, MYSQL & Javascript",
		pengarang: "Didik Setiawan",
		isbn: "9786026673343",
		sampul:
			"https://cdn.gramedia.com/uploads/items/9786026673343_9786026673343.jpg",
	},
	{
		id: 2,
		judul: "Cepat Mahir MySQL dan SQLite",
		pengarang: "Hendry, ST",
		isbn: "9786020275451",
		sampul:
			"https: //cdn.gramedia.com/uploads/images/1/28217/big_covers/ID_EMK2015MTH11CMMDS_B.jpg",
	},
	{
		id: 3,
		judul: "Lancar Java Dan Javascript",
		pengarang: "Jubilee Enterprise",
		isbn: "9786230005633",
		sampul:
			"https://cdn.gramedia.com/uploads/items/9786230005633_Cov_Lancar_Ja.jpg",
	},
	{
		id: 4,
		judul: "Membuat Aplikasi Android Tanpa Coding",
		pengarang: "Arista Prasetyo Adi",
		isbn: "9786230023927",
		sampul:
			"https://cdn.gramedia.com/uploads/items/9786230023927_Membuat_Aplikasi_Android_Tanpa_Coding.jpg",
	},
	{
		id: 5,
		judul: "Pemrograman Android Dengan Flutter",
		pengarang: "Budi Raharjo",
		isbn: "9786237131069",
		sampul:
			"https://cdn.gramedia.com/uploads/items/208024510_Pemrograman-Android-Dengan-Flutter-Cd.jpg",
	},
	{
		id: 6,
		judul: "Pemrograman Python Untuk Penanganan Big Data",
		pengarang: "Hanna Arini Parhusip",
		isbn: "9786230104008",
		sampul: "https://cdn.gramedia.com/uploads/items/Pemrogran_Python.jpg",
	},
];

app.get("/", (req, res) => {
	res.send("Server is running!");
});

app.get("/list-book", (req, res) => {
	res.status(200).json({
		status: 200,
		data: dataDummy,
	});
});

app.get("/get-book/:id", (req, res) => {
	const bookId = req.params.id;
	let data = null;

	for (let index = 0; index < dataDummy.length; index++) {
		if (dataDummy[index].id == bookId) {
			data = dataDummy[index];
			break;
		}
	}

	if (data === null) {
		return res.status(404).json({
			status: 404,
			data: null,
			message: "data buku tidak ditemukan",
		});
	}

	res.status(200).json({
		status: 200,
		data: data,
		message: "Berhasil menemukan data buku",
	});
});

app.get("/get-book-query", (req, res) => {
	const bookId = req.query.id;
	const data = dataDummy.find(data => data.id == bookId);

	if (!data) {
		return res.status(404).json({
			status: 404,
			data: null,
			message: "data buku tidak ditemukan",
		});
	}

	res.status(200).json({
		status: 200,
		data: data,
		message: "Berhasil menemukan data buku",
	});
});

// Search Book
app.get("/search-book", (req, res) => {
	const keyword = req.query.search;
	const data = [];

	dataDummy.forEach(book => {
		if(book.judul.toLowerCase().includes(keyword.toLowerCase())){
			console.log(book);
			data.push(book);
		}
	});

	if(data.length === 0){
		return res.status(404).json({
			status: 404,
			data: null,
			message: "data buku tidak ditemukan",
		});
	}

	res.status(200).json({
		status: 200,
		data,
		message: "Berhasil menemukan data buku",
	});
});

app.post("/create-book", (req, res) => {
	const { judul, pengarang, isbn, sampul } = req.body;

	const data = {
		id: dataDummy.length + 1,
		judul,
		pengarang,
		isbn,
		sampul
	}

	dataDummy.push(data);
	res.status(201).json({
		status: 201,
		data,
		message: "Berhasil menambah data buku",
	});
});

app.put("/update-book/:id", (req, res) => {
	const bookId = req.params.id;
	const { judul, pengarang, isbn, sampul } = req.body;

	let indexUpdateBook = -1;
	for (let index = 0; index < dataDummy.length; index++) {
		if(dataDummy[index].id == bookId){
			indexUpdateBook = index;
			break;
		}
	}

	if(indexUpdateBook === -1){
		return res.status(404).json({
			status: 404,
			data: null,
			message: "data buku tidak ditemukan",
		});
	}

	dataDummy[indexUpdateBook] = {
		id: bookId,
		judul,
		pengarang,
		isbn,
		sampul,
	};

	res.status(200).json({
		status: 200,
		data: dataDummy[indexUpdateBook],
		message: "Berhasil mengubah data buku",
	});
});

app.delete("/delete-book/:id", (req, res) => {
	const bookId = req.params.id;

	let indexDeleteBook = -1;
	for (let index = 0; index < dataDummy.length; index++) {
		if (dataDummy[index].id == bookId) {
			indexDeleteBook = index;
			break;
		}
	}

	if (indexDeleteBook === -1) {
		return res.status(404).json({
			status: 404,
			data: null,
			message: "data buku tidak ditemukan",
		});
	}

	dataDummy.splice(indexDeleteBook, 1);
	res.status(200).json({
		status: 200,
		message: "Berhasil mendelete data buku",
	});
});

app.listen(3000, () => {
	console.log("App listen on port 3000");
});
