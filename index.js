(d => {
	const bookContainer = d.querySelector(".list-book");
	const searchBooks = d.querySelector(".search");

	const getBooks = async book => {
		const response = await fetch(
			`https://www.googleapis.com/books/v1/volumes?q=${book}`
		);
		const data = await response.json();

		return data;
	};

	const drawListBook = async () => {
		if (searchBooks.value !== "") {
			const data = await getBooks(searchBooks.value);

			bookContainer.innerHTML = data.items
				.map(({
					volumeInfo
				}) => {
					const title = volumeInfo.title.replace(
						`/${searchBooks.value}/gi`, x => `<span>${x}</span>`
					);
					return `<div class="book"><img class="thumbnail" src="${volumeInfo.imageLinks.thumbnail}"><div class="book-info"><a href="${volumeInfo.infoLink}" target="	_blank"><h2 class="book-title">${volumeInfo.title}</h2></a><div class="book-authors">${volumeInfo.authors}</div></div></div>`;
				})
				.join("");
		}
	};

	const debounce = (fn, time, to = null) =>
		to ? clearTimeout(to) : (to = setTimeout(drawListBook, time));

	searchBooks.addEventListener("input", () => debounce(drawListBook, 2000));
})(document);
