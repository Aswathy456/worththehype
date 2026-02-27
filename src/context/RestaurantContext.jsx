import { createContext, useContext, useState } from "react";

const RestaurantContext = createContext(null);

export function RestaurantProvider({ children }) {
  const [allRestaurants, setAllRestaurants] = useState({});
  // allRestaurants shape: { Kochi: [...], Trivandrum: [...], Kozhikode: [...] }

  const setCity = (city, data) => {
    setAllRestaurants(prev => ({ ...prev, [city]: data }));
  };

  const findById = (id) => {
    for (const city of Object.values(allRestaurants)) {
      const found = city.find(r => String(r.id) === String(id));
      if (found) return found;
    }
    return null;
  };

  return (
    <RestaurantContext.Provider value={{ allRestaurants, setCity, findById }}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurants() {
  return useContext(RestaurantContext);
}