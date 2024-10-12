import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', async () => {
    feather.replace();
    await loadItems();

    document.getElementById('add-item-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = document.getElementById('new-item');
        const text = input.value.trim();
        if (text) {
            showSpinner();
            await backend.addItem(text);
            input.value = '';
            await loadItems();
            hideSpinner();
        }
    });
});

async function loadItems() {
    showSpinner();
    const items = await backend.getItems();
    const list = document.getElementById('shopping-list');
    list.innerHTML = '';
    items.forEach(item => {
        const li = document.createElement('li');
        li.className = 'flex items-center justify-between p-2 bg-gray-700 rounded';
        li.innerHTML = `
            <span class="flex items-center">
                <input type="checkbox" ${item.completed ? 'checked' : ''} class="mr-2 form-checkbox h-5 w-5 text-blue-500 rounded focus:ring-blue-500" data-id="${item.id}">
                <span class="${item.completed ? 'line-through text-gray-500' : ''}">${item.text}</span>
            </span>
            <button class="text-red-500 hover:text-red-600 transition duration-200" data-id="${item.id}">
                <i data-feather="trash-2"></i>
            </button>
        `;
        list.appendChild(li);

        li.querySelector('input[type="checkbox"]').addEventListener('change', async (e) => {
            showSpinner();
            await backend.completeItem(Number(e.target.dataset.id));
            await loadItems();
            hideSpinner();
        });

        li.querySelector('button').addEventListener('click', async () => {
            showSpinner();
            await backend.deleteItem(Number(item.id));
            await loadItems();
            hideSpinner();
        });
    });
    feather.replace();
    hideSpinner();
}

function showSpinner() {
    const spinner = document.createElement('div');
    spinner.id = 'spinner';
    spinner.className = 'fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50';
    spinner.innerHTML = '<i data-feather="loader" class="animate-spin text-white w-12 h-12"></i>';
    document.body.appendChild(spinner);
    feather.replace();
}

function hideSpinner() {
    const spinner = document.getElementById('spinner');
    if (spinner) {
        spinner.remove();
    }
}
