export function addBtnAddMore() {
    const divBtnAddMore = document.querySelector('.js_btn_add_More')

    divBtnAddMore.innerHTML = '<button class="btnAddMore">Add More</button>';
    const btnAddMore = document.querySelector('.btnAddMore');
    btnAddMore.addEventListener('click', async () => addCard(event)); // Обработчик события для кнопки "Add More"
  }
  