let bookContainer = document.querySelector('.search-book')
let searchBooks = document.getElementById('search')
const getBooks = async book => {
	const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${book}`)
	const data = await response.json()
	return data
}
const drawChartBook = async (subject) => {
	let cbookContainer = document.querySelector(`.${subject}-book`)
	cbookContainer.innerHTML = `<div class='prompt'><div class="loader"></div><div>Loading...</div></div>`
	const cdata = await getBooks(`subject:${subject}&maxResults=6&orderBy=newest`)
	if (cdata.error) {
		cbookContainer.innerHTML = `<div class='prompt'><div class='prompt'>😕</div>Limit exceeded! Try after some time</div>`
	} else if (cdata.totalItems == 0) {
		cbookContainer.innerHTML = `<div class='prompt'><div class='prompt'>😕</div>No results, try a different term!</div>`
	} else if (cdata.totalItems == undefined) {
		cbookContainer.innerHTML = `<div class='prompt'><div class='prompt'>😕</div>Network problem!</div>`
	} else {
		cbookContainer.innerHTML = cdata.items
			.map(({
				volumeInfo
			}) => `<div class='book'><a href='${volumeInfo.infoLink}' target='_blank'><img class='thumbnail' src='${volumeInfo.imageLinks.thumbnail}' onerror='this.src="icons/logo.svg";'></a><div class='book-info'><a href='${volumeInfo.infoLink}' target='_blank'><h3 class='book-title'>${volumeInfo.title}</h3></a><div class='book-authors' onclick='updateFilter(this,"author");'>${volumeInfo.authors}</div><div class='info' onclick='updateFilter(this,"subject");'>${volumeInfo.categories}</div></div></div>`)
			.join('')
	}
}
const drawListBook = async () => {
	if (searchBooks.value != '') {
		bookContainer.innerHTML = `<div class='prompt'><div class="loader"></div><div>Searching...</div></div>`
		const data = await getBooks(searchBooks.value)
		if (data.error) {
			bookContainer.innerHTML = `<div class='prompt'><div class='prompt'>😕</div>Limit exceeded! Try after some time</div>`
		} else if (data.totalItems == 0) {
			bookContainer.innerHTML = `<div class='prompt'><div class='prompt'>😕</div>No results, try a different term!</div>`
		} else if (data.totalItems == undefined) {
			bookContainer.innerHTML = `<div class='prompt'><div class='prompt'>😕</div>Network problem!</div>`
		} else {
			bookContainer.innerHTML = data.items
				.map(({
					volumeInfo
				}) => `<div class='book'><a href='${volumeInfo.infoLink}' target='_blank'><img class='thumbnail' src='${volumeInfo.imageLinks.thumbnail}' onerror='this.src="icons/logo.svg";'></a><div class='book-info'><a href='${volumeInfo.infoLink}' target='_blank'><h3 class='book-title'>${volumeInfo.title}</h3></a><div class='book-authors' onclick='updateFilter(this,"author");'>${volumeInfo.authors}</div><div class='info' onclick='updateFilter(this,"subject");'>${volumeInfo.categories}</div></div></div>`)
				.join('')
		}
	} else {
		bookContainer.innerHTML = `<div class='prompt'>Enter a search term</div>`
	}
}
const updateFilter = ({
	innerHTML
}, f) => {
	document.getElementById('main').scrollIntoView({
		behavior: 'smooth'
	})
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
const debounce = (fn, time, to = 0) => {
	to ? clearTimeout(to) : (to = setTimeout(drawListBook, time))
}
searchBooks.addEventListener('input', () => {
	debounce(drawListBook, 1000)
})
document.addEventListener('DOMContentLoaded', () => {
	drawChartBook('fiction')
	drawChartBook('poetry')
	drawChartBook('fantasy')
	drawChartBook('romance')
})
const scrollInto = (target) => {
	document.getElementById(`${target}-book`).scrollIntoView({
		behavior: 'smooth'
	})
}
