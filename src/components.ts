import RestaurantApiWrapper, {
  Restaurant,
} from './classes/RestaurantApiWrapper.js';

const restaurantManager = new RestaurantApiWrapper();

const restaurantRow = (restaurant: Restaurant) => {
  const tr = document.createElement('tr');
  const name = document.createElement('td');
  const address = document.createElement('td');
  name.innerText = restaurant.name;
  address.innerText = restaurant.address;
  tr.appendChild(name);
  tr.appendChild(address);
  return tr;
};

const restaurantModal = async (restaurant: Restaurant) => {
  const content = document.createElement('div');
  const name = document.createElement('h1');
  const location = document.createElement('h2');
  const phone = document.createElement('h3');
  const company = document.createElement('h4');
  name.innerText = restaurant.name;
  location.innerText = `${restaurant.address}, ${restaurant.postalCode} ${restaurant.city}`;
  phone.innerText = restaurant.phone;
  company.innerText = restaurant.company;

  const closeButton = document.createElement('button');
  closeButton.innerText = 'Close';
  closeButton.addEventListener(
    'click',
    () => document.querySelector('dialog')?.close()
  );

  content.appendChild(name);
  content.appendChild(location);
  content.appendChild(phone);
  content.appendChild(company);
  content.appendChild(closeButton);

  const menu = await restaurantManager
    .getDailyMenu(restaurant._id)
    .catch(err => {
      const e = document.createElement('p');
      e.innerText = 'Menu not available';
      content.appendChild(e);
    });

  if (menu) {
    const table = document.createElement('table');
    const menuHeader = document.createElement('h5');
    menuHeader.innerText = 'Menu';
    table.appendChild(menuHeader);

    for (const course of menu.courses) {
      const tr = document.createElement('tr');
      const name = document.createElement('td');
      const price = document.createElement('td');
      name.innerText = course.name;
      price.innerText = course.price;
      tr.appendChild(name);
      tr.appendChild(price);
      table.appendChild(tr);
    }

    content.appendChild(table);
  }

  return content;
};

export {restaurantRow, restaurantModal};
