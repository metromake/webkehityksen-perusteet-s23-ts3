import RestaurantApiWrapper, {
  Restaurants,
} from './classes/RestaurantApiWrapper';
import {restaurantRow, restaurantModal} from './components';

const filterRestaurants = (
  restaurants: Restaurants,
  filter = 'none'
): Restaurants => {
  switch (filter) {
    case 'none':
      return restaurants;
    case 'sodexo':
      return restaurants.filter(restaurant => restaurant.company === 'Sodexo');
    case 'compass':
      return restaurants.filter(
        restaurant => restaurant.company === 'Compass Group'
      );
    default:
      return restaurants;
  }
};

const render = async (restaurants: Restaurants): Promise<void> => {
  const restaurantsElement = document.getElementsByTagName('table')[0];
  restaurantsElement.innerHTML = '';
  for (const restaurant of restaurants) {
    const row = restaurantRow(restaurant);
    row.addEventListener('click', async () => {
      for (const element of document.getElementsByClassName('highlight'))
        element.classList.remove('highlight');
      row.classList.add('highlight');
      const dialog = document.getElementsByTagName('dialog')[0];
      dialog.innerHTML = '';
      dialog.appendChild(await restaurantModal(restaurant));
      dialog.showModal();
    });
    restaurantsElement.appendChild(row);
  }
};

const main = async () => {
  const restaurantManager = new RestaurantApiWrapper();
  const restaurants = await restaurantManager.getRestaurants().catch(err => {
    const e = document.createElement('p');
    e.innerText = 'Error fetching restaurants';
    document.getElementsByTagName('body')[0].appendChild(e);
  });

  if (!restaurants) return;
  restaurants.sort((a, b) => (a.name > b.name ? 1 : 0));

  const filter = document.getElementById('filter') as
    | HTMLInputElement
    | undefined;
  filter?.addEventListener('input', () =>
    render(filterRestaurants(restaurants, filter.value))
  );

  render(filterRestaurants(restaurants, filter?.value));
};

main();
