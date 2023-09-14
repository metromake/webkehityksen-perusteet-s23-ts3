export interface Restaurant {
  _id: string;
  companyId: number;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  location: {
    type: 'point';
    coordinates: [number, number];
  };
  company: 'Sodexo' | 'Compass Group';
}

export type Restaurants = Restaurant[];

interface Course {
  name: string;
  price: string;
  diets: string[];
}

interface DailyMenu {
  courses: Course[];
}

type Endpoint =
  | `${'restaurants'}`
  | `${'restaurants/daily'}/${string}/${string}`
  | `${'restaurants/weekly'}/${string}/${string}`
  | `${'restaurants/daily'}/${string}/${string}/${string}`
  | `${'restaurants/weekly'}/${string}/${string}/${string}`;

class RestaurantApiWrapper {
  private _url = 'https://sodexo-webscrape-r73sdlmfxa-lz.a.run.app/api/v1/';
  constructor() {}

  public async getRestaurants(): Promise<Restaurants> {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const restaurants = await this.fetchData('restaurants', options).catch(
      err => {
        throw new Error(err);
      }
    );
    return restaurants;
  }

  public async getDailyMenu(restaurantId: string): Promise<DailyMenu> {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const menu = await this.fetchData(
      `restaurants/daily/${restaurantId}/'fi'`,
      options
    ).catch(err => {
      throw new Error(err);
    });
    return menu;
  }

  private async fetchData(
    endpoint: Endpoint,
    options: RequestInit
  ): Promise<any> {
    const req = await fetch(`${this._url}${endpoint}`, options);
    if (req.status < 200 || req.status > 299)
      throw new Error(req.status.toString());

    const json = await req.json();

    return json;
  }
}

export default RestaurantApiWrapper;
