let bookContainer = document.querySelector('.list-book')
let searchBooks = document.getElementById('search')
const getBooks = async book => {
	const response = await fetch(
		`https://www.googleapis.com/books/v1/volumes?q=${book}`
	)
	const data = await response.json()
	return data
}
const drawListBook = async () => {
	if (searchBooks.value != '') {
		bookContainer.innerHTML = 'Searching..'
		const data = await getBooks(searchBooks.value)
		bookContainer.innerHTML = data.items
			.map(({
				volumeInfo
			}) => `<div class='book'><a href='${volumeInfo.infoLink}' target='_blank'><img class='thumbnail' src='${volumeInfo.imageLinks.thumbnail}'></a><div class='book-info'><a href='${volumeInfo.infoLink}' target='_blank'><h3 class='book-title'>${volumeInfo.title}</h3></a><div class='book-authors' onclick='updateFilter(this,"author");'>${volumeInfo.authors}</div><div class='info' onclick='updateFilter(this,"subject");'>${volumeInfo.categories}</div></div></div>`)
			.join('')
	} else {
		bookContainer.innerHTML = 'Enter a search term'
	}
}
const updateFilter = ({
	innerHTML
}, f) => {
	let m
	switch (f) {
		case 'author':
			m = 'inauthor:'
			break
		case 'subject':
			m = 'subject:'
			break
	}
	searchBooks.value = m + innerHTML
	debounce(drawListBook, 1000)
}
const debounce = (fn, time, to = null) =>
	to ? clearTimeout(to) : (to = setTimeout(drawListBook, time))
searchBooks.addEventListener('input', () => debounce(drawListBook, 2000))
