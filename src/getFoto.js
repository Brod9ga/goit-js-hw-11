export async function getFoto() {
    const searchFoto = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '36610432-c2e311e7e488000960139023f',
        q: wordToSeach,
        orientation: 'horizontal',
        safesearch: true,
        per_page: '40',
        page: pages,
      },
    });
    return searchFoto;
  }
  