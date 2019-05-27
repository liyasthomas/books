let bookContainer = document.querySelector('.search')
let searchBooks = document.getElementById('search-box')
const getBooks = async book => {
	const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${book}`)
	const data = await response.json()
	return data
}
const drawChartBook = async (subject, startIndex = 0) => {
	let cbookContainer = document.querySelector(`.${subject}`)
	cbookContainer.innerHTML = `<div class='prompt'><div class="loader"></div></div>`
	const cdata = await getBooks(`subject:${subject}&startIndex=${startIndex}&maxResults=6&orderBy=newest`)
	if (cdata.error) {
		cbookContainer.innerHTML = `<div class='prompt'>ツ Limit exceeded! Try after some time</div>`
	} else if (cdata.totalItems == 0) {
		cbookContainer.innerHTML = `<div class='prompt'>ツ No results, try a different term!</div>`
	} else if (cdata.totalItems == undefined) {
		cbookContainer.innerHTML = `<div class='prompt'>ツ Network problem!</div>`
	} else {
		cbookContainer.innerHTML = cdata.items
			.map(({
				volumeInfo
			}) => `<div class='book' style='background: linear-gradient(` + getRandomColor() + `, rgba(0, 0, 0, 0));'><img class='thumbnail trigger' src='` + (volumeInfo.imageLinks.thumbnail === undefined ? 'icons/logo.svg' : volumeInfo.imageLinks.thumbnail.replace('http://', 'https://')) + `' alt='cover' data-cover='` + (volumeInfo.imageLinks.thumbnail === undefined ? 'icons/logo.svg' : volumeInfo.imageLinks.thumbnail.replace('http://', 'https://')) + `' data-isbn='${volumeInfo.title}' data-title='${volumeInfo.title}' data-authors='${volumeInfo.authors}'><div class='book-info'><h3 class='book-title trigger' data-cover='` + (volumeInfo.imageLinks.thumbnail === undefined ? 'icons/logo.svg' : volumeInfo.imageLinks.thumbnail.replace('http://', 'https://')) + `' data-isbn='${volumeInfo.title}' data-title='${volumeInfo.title}' data-authors='${volumeInfo.authors}'>${volumeInfo.title}</h3><div class='book-authors' onclick='updateFilter(this,"author");'>${volumeInfo.authors}</div><div class='info' onclick='updateFilter(this,"subject");' style='background-color: ` + getRandomColor() + `;'>` + (volumeInfo.categories === undefined ? 'Others' : volumeInfo.categories) + `</div></div></div>`)
			.join('')
	}
}
const drawListBook = async () => {
	if (searchBooks.value != '') {
		bookContainer.style.display = 'flex'
		bookContainer.innerHTML = `<div class='prompt'><div class="loader"></div></div>`
		const data = await getBooks(`${searchBooks.value}&maxResults=6`)
		if (data.error) {
			bookContainer.innerHTML = `<div class='prompt'>ツ Limit exceeded! Try after some time</div>`
		} else if (data.totalItems == 0) {
			bookContainer.innerHTML = `<div class='prompt'>ツ No results, try a different term!</div>`
		} else if (data.totalItems == undefined) {
			bookContainer.innerHTML = `<div class='prompt'>ツ Network problem!</div>`
		} else {
			bookContainer.innerHTML = data.items
				.map(({
					volumeInfo
				}) => `<div class='book' style='background: linear-gradient(` + getRandomColor() + `, rgba(0, 0, 0, 0));'><img class='thumbnail trigger' src='` + (volumeInfo.imageLinks.thumbnail === undefined ? 'icons/logo.svg' : volumeInfo.imageLinks.thumbnail.replace('http://', 'https://')) + `' alt='cover' data-cover='` + (volumeInfo.imageLinks.thumbnail === undefined ? 'icons/logo.svg' : volumeInfo.imageLinks.thumbnail.replace('http://', 'https://')) + `' data-isbn='${volumeInfo.title}' data-title='${volumeInfo.title}' data-authors='${volumeInfo.authors}'><div class='book-info'><h3 class='book-title trigger' data-cover='` + (volumeInfo.imageLinks.thumbnail === undefined ? 'icons/logo.svg' : volumeInfo.imageLinks.thumbnail.replace('http://', 'https://')) + `' data-isbn='${volumeInfo.title}' data-title='${volumeInfo.title}' data-authors='${volumeInfo.authors}'>${volumeInfo.title}</h3><div class='book-authors' onclick='updateFilter(this,"author");'>${volumeInfo.authors}</div><div class='info' onclick='updateFilter(this,"subject");' style='background-color: ` + getRandomColor() + `;'>` + (volumeInfo.categories === undefined ? 'Others' : volumeInfo.categories) + `</div></div></div>`)
				.join('')
		}
	} else {
		bookContainer.style.display = 'none'
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
	drawChartBook('love')
	drawChartBook('feminism')
	drawChartBook('inspirational')
	drawChartBook('authors')
	drawChartBook('fiction')
	drawChartBook('poetry')
	drawChartBook('fantasy')
	drawChartBook('romance')
})
let mainNavLinks = document.querySelectorAll('.nav')
window.addEventListener('scroll', event => {
	let fromTop = window.scrollY + 64
	mainNavLinks.forEach(({
		hash,
		classList
	}) => {
		let section = document.querySelector(hash)
		if (section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) {
			classList.add('current')
		} else {
			classList.remove('current')
		}
	})
})
const getRandomColor = () => {
	let letters = '0123456789ABCDEF'
	let color = '#'
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)]
	}
	color += '40'
	return color
}
const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]')
const switchTheme = ({
	target
}) => {
	if (target.checked) {
		document.documentElement.setAttribute('data-theme', 'dark')
	} else {
		document.documentElement.setAttribute('data-theme', 'light')
	}
}
toggleSwitch.addEventListener('change', switchTheme, false)
let startIndex = 0
const next = (subject) => {
	startIndex += 6
	if (startIndex >= 0) {
		document.getElementById(`${subject}-prev`).style.display = 'inline-flex'
		drawChartBook(subject, startIndex)
	} else {
		document.getElementById(`${subject}-prev`).style.display = 'none'
	}
}
const prev = (subject) => {
	startIndex -= 6
	if (startIndex <= 0) {
		startIndex = 0
		drawChartBook(subject, startIndex)
		document.getElementById(`${subject}-prev`).style.display = 'none'
	} else {
		document.getElementById(`${subject}-prev`).style.display = 'inline-flex'
		drawChartBook(subject, startIndex)
	}
}
const modal = document.querySelector(".modal");
const closeButton = document.querySelector(".close-button");
const toggleModal = () => {
	modal.classList.toggle("show-modal");
}
const windowOnClick = ({
	target
}) => {
	if (target === modal) {
		toggleModal();
	}
}
const hasClass = ({
	classList
}, className) => {
	return classList.contains(className);
}
document.addEventListener('click', ({
	target
}) => {
	if (hasClass(target, 'trigger')) {
		toggleModal()
		document.getElementById('preview-cover').src = target.dataset.cover
		document.getElementById('preview-title').textContent = target.dataset.title
		document.getElementById('preview-authors').textContent = target.dataset.authors
	}
}, false);
closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);
