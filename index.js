// // создание таблицы
function createTable() {
    const tableTitle = [
        { name: 'FIO', value: 'ФИО' },
        { name: 'birthday', value: 'Дата рождения' },
        { name: 'yearStudy', value: 'Годы обучения' },
        { name: 'facultet', value: 'Факультет' },
    ]
    // Создание таблицы
    const tableContainer = document.getElementById('table__container');
    const table = document.createElement('table');
    const caption = document.createElement('caption');
    const tableBody = document.createElement('tbody');
    const trTitle = document.createElement('tr');

    for (let i in tableTitle) {
        const tdTitle = document.createElement('td');
        tdTitle.classList.add('td', 'td-title');
        tdTitle.innerText = tableTitle[i].value;
        tdTitle.dataset.path = tableTitle[i].name;
        trTitle.append(tdTitle);
    }

    table.classList.add('table');
    caption.classList.add('caption');
    caption.innerText = 'Студенты';

    tableBody.append(trTitle);
    table.append(caption);
    table.append(tableBody);
    tableContainer.append(table);
}

// добавление стилей для инпутов даты
function styleAddForm() {
    let date = new Date();

    // Максимальное значение для даты рождения
    const birthday = document.getElementsByName('birthday');
    if (date.getMonth() < 10) {
        let currentMonth = `0${date.getMonth() + 1}`
        birthday[0].max = `${date.getFullYear()}-${currentMonth}-${date.getDate()}`;
    } else {
        let currentMonth = date.getMonth() + 1
        birthday[0].max = `${date.getFullYear()}-${currentMonth}-${date.getDate()}`;
    }

    // Максимальное значение для года обучения
    const yearStudy = document.getElementsByName('yearStudy');
    yearStudy[0].max = date.getFullYear();
}

// Создание строки таблицы
function createTableItem(tableItem) {
    // console.log(tableItem)
    // Создание строк таблицы
    const trTitle = document.createElement('tr');
    trTitle.classList.add('item-stroke');
    for (let i in tableItem) {
        const tdTitle = document.createElement('td');
        tdTitle.classList.add('td');
        tdTitle.innerText = tableItem[i].value;
        tdTitle.dataset.path = tableItem[i].name;
        trTitle.append(tdTitle);
    }
    const tableBody = document.querySelector('tbody');
    tableBody.append(trTitle);
}

// сбор всех строк в объекты
function collectData() {
    let allTableStroke = [];
    let tableStroke = document.querySelectorAll('.item-stroke');
    tableStroke.forEach(item => {
        const { childNodes } = item;
        let data = Array.from(childNodes)

            .map(element => {
                const { innerText, dataset } = element
                const name = dataset.path;
                const value = innerText;
                item.remove()
                return { name, value }
            })
        // console.log(data)
        allTableStroke.push(data)
    })
    return allTableStroke;
}

// фильтр по шапке таблицы
function tableFilter(e) {

    const filterName = e.target.dataset.path;
    const allTableStroke = collectData();

    allTableStroke.sort((a, b) => {
        for (let i in a) {
            // console.log('aaa', a[i])
            // console.log(b[i])
            if (a[i].name === filterName) {
                if (a[i].value > b[i].value) {
                    return 1;
                }
                if (a[i].value < b[i].value) {
                    return -1;
                }
                // a должно быть равным b
                return 0;
            }
        }
    })

    // console.log(allTableStroke)

    // строим DOM дерево нашего списка
    allTableStroke.map(filterStroke => {
        createTableItem(filterStroke);
    })
}

// выдача совпадений при вводе в строку поиска
function searchTableStroke(e) {
    const searchName = e.target.value;
    let allStroke = document.querySelectorAll('.item-stroke');
    allStroke.forEach(stroke => {
        // console.log(stroke.childNodes)
        const { childNodes } = stroke;
        const data = Array.from(childNodes);
        for (let strokeItem of data) {
            const { innerText } = strokeItem;
            // console.log(typeof(searchName));
            if (innerText.includes(searchName)) {
                // console.log(stroke)
                stroke.style.display = 'table-row';
                break;
            }
            stroke.style.display = 'none';
        }
        // console.log(data)
    })
}

// обработка данных с формы
function handleFormSubmit(event) {
    event.preventDefault();
    const { elements } = event.target;
    const data = Array.from(elements)
        .filter(item => !!item.name)
        .map(element => {
            let date = new Date();
            let { name, value } = element;

            // Отредактируем текстовые поля
            if (element.type === 'text') {
                const FIO = value.split(' ')
                    .map(vord => vord
                        .trim()
                        .toLowerCase())
                    .join(' ');
            }

            // просчитаем курс обучения
            if (element.type === 'number') {
                const startStudy = Math.abs(new Date(`September 1, ${value} 00:00:00:000`).getTime());
                let courseMilliseconds = (Date.now()) - startStudy;
                let course = Math.ceil(courseMilliseconds / (1000 * 3600 * 24 * 365));

                if (course <= 4) {
                    value = `${value}-${Number(value) + 4} (${course} курс)`
                } else {
                    value = `${value}-${Number(value) + 4} (закончил)`
                }
            }

            // рассчитаем возраст
            if (element.type === 'date') {
                const yearBirthday = value.substring(0, 4);
                const monthBirthday = value.substring(5, 7);
                const dayBirthday = value.substring(8, 10);

                const Birthday = Math.abs(new Date(`${monthBirthday} ${dayBirthday}, ${yearBirthday} 00:00:00:000`).getTime());
                let ageMilliseconds = Date.now() - Birthday;
                let age = Math.floor(ageMilliseconds / (1000 * 3600 * 24 * 366));
                value = `${dayBirthday}.${monthBirthday}.${yearBirthday} (${age} лет)`
            }
            return { name, value }
        })
    event.target.reset();
    createTableItem(data);
    const allTableStroke = collectData();
    allTableStroke.map(tableStroke => { createTableItem(tableStroke) });
}

// валидация на инпуте
function checkValidation(event) {
    const form = event.target.form;
    const isValid = form.checkValidity();
    let validInput = false;

    for (let formItem of form) {
        if (formItem.type === "submit") {
            validInput = false;
            break;
        };
        if (!formItem.value.trim().length) {
            validInput = true;
            break;
        }
    }
    form.querySelector('.add-form__button').disabled = (!isValid || validInput);
}

document.addEventListener('DOMContentLoaded', () => {
    createTable();
    styleAddForm();

    // открыть форму
    const addForm = document.querySelector('.add-form');
    const btnAddForm = document.querySelector('.btn-add-form-open');
    btnAddForm.addEventListener('click', () => {
        addForm.style.display = 'flex';
    });

    // скрыть форму
    const btnCloseAddForm = document.querySelector('.add-form__close-icon');
    btnCloseAddForm.addEventListener('click', () => {
        addForm.style.display = 'none';
    });

    // при отправки данных с формы
    addForm.addEventListener('submit', handleFormSubmit)

    // при заполнении формы
    addForm.addEventListener('input', checkValidation)

    // слушатель шапки таблицы
    const tableTitleItem = document.querySelectorAll('.td-title');
    tableTitleItem.forEach(item => {
        item.addEventListener('click', tableFilter);
    });

    // слушатель формы поиска по таблице
    const searchForm = document.querySelector(".search-form__input");
    searchForm.addEventListener('input', searchTableStroke);

});
