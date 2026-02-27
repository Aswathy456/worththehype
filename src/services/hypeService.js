// hypeService.js
// Calculate which restaurant is the "Hype of the Month" based on multiple factors

/**
 * Calculate the hype score for a restaurant based on:
 * - Number of reviews (activity)
 * - Hype score (community perception)
 * - Reality score (actual quality)
 * - Recent momentum (simulated growth trend)
 */
function calculateRestaurantHype(restaurant) {
  const reviewWeight = 0.3;
  const hypeWeight = 0.4;
  const realityWeight = 0.3;

  // Normalize reviews to a 0-10 scale (assuming max ~500 reviews)
  const normalizedReviews = Math.min(restaurant.reviews / 50, 10);

  const hypeScore = (
    normalizedReviews * reviewWeight +
    restaurant.hypeScore * hypeWeight +
    restaurant.realityScore * realityWeight
  );

  return hypeScore;
}

/**
 * Generate simulated trend data for the past 8 weeks
 * Uses restaurant ID as seed for consistent but varied trends
 */
function generateTrendData(restaurant) {
  const weeks = 8;
  const currentScore = calculateRestaurantHype(restaurant);
  
  // Use restaurant ID to seed random but consistent trends
  const seed = restaurant.id;
  const trendType = (seed % 3); // 0 = rising, 1 = peaked, 2 = volatile
  
  const data = [];
  const labels = ['8w ago', '7w ago', '6w ago', '5w ago', '4w ago', '3w ago', '2w ago', 'Now'];
  
  for (let i = 0; i < weeks; i++) {
    let value;
    
    if (trendType === 0) {
      // Rising trend - steady growth
      const progress = i / (weeks - 1);
      value = currentScore * 0.6 + (currentScore * 0.4 * progress);
      // Add some variation
      value += (Math.sin(seed * i) * 0.3);
    } else if (trendType === 1) {
      // Peaked - was higher, now stabilizing
      const progress = i / (weeks - 1);
      const peak = weeks * 0.6;
      if (i < peak) {
        value = currentScore * (0.7 + (i / peak) * 0.3);
      } else {
        value = currentScore * (1 - ((i - peak) / (weeks - peak)) * 0.1);
      }
    } else {
      // Volatile - up and down
      value = currentScore + Math.sin(seed + i) * (currentScore * 0.2);
    }
    
    // Add weekly noise
    value += (Math.sin(seed * i * 1.5) * 0.5);
    
    // Ensure value is within reasonable bounds
    value = Math.max(5, Math.min(10, value));
    
    data.push({
      week: i,
      label: labels[i],
      value: value,
    });
  }
  
  return data;
}

/**
 * Calculate momentum (percentage change from last week)
 */
function calculateMomentum(trendData) {
  if (trendData.length < 2) return 0;
  
  const current = trendData[trendData.length - 1].value;
  const previous = trendData[trendData.length - 2].value;
  
  const percentChange = ((current - previous) / previous) * 100;
  return percentChange;
}

/**
 * Find the restaurant with the highest hype this month
 */
export function calculateHypeOfTheMonth(restaurants) {
  if (!restaurants || restaurants.length === 0) {
    return null;
  }

  // Calculate hype score for each restaurant
  const restaurantsWithHype = restaurants.map(r => ({
    ...r,
    calculatedHype: calculateRestaurantHype(r),
  }));

  // Sort by hype score
  restaurantsWithHype.sort((a, b) => b.calculatedHype - a.calculatedHype);

  // Get the top restaurant
  const topRestaurant = restaurantsWithHype[0];

  // Generate trend data
  const trendData = generateTrendData(topRestaurant);

  // Calculate momentum
  const momentum = calculateMomentum(trendData);

  return {
    restaurant: topRestaurant,
    hypeScore: topRestaurant.calculatedHype,
    trendData,
    momentum,
  };
}

/**
 * Get top N hyped restaurants for a "trending" section
 */
export function getTopHypedRestaurants(restaurants, limit = 5) {
  if (!restaurants || restaurants.length === 0) {
    return [];
  }

  const restaurantsWithHype = restaurants.map(r => ({
    ...r,
    calculatedHype: calculateRestaurantHype(r),
    momentum: calculateMomentum(generateTrendData(r)),
  }));

  restaurantsWithHype.sort((a, b) => b.calculatedHype - a.calculatedHype);

  return restaurantsWithHype.slice(0, limit);
}

/**
 * Check if a restaurant is "trending up" (positive momentum)
 */
export function isTrendingUp(restaurant) {
  const trendData = generateTrendData(restaurant);
  const momentum = calculateMomentum(trendData);
  return momentum > 5; // At least 5% increase
}

/**
 * Get restaurants that are gaining hype (rising stars)
 */
export function getRisingStars(restaurants, limit = 3) {
  if (!restaurants || restaurants.length === 0) {
    return [];
  }

  const restaurantsWithMomentum = restaurants.map(r => {
    const trendData = generateTrendData(r);
    return {
      ...r,
      momentum: calculateMomentum(trendData),
    };
  });

  // Filter for positive momentum and sort
  const rising = restaurantsWithMomentum
    .filter(r => r.momentum > 5)
    .sort((a, b) => b.momentum - a.momentum);

  return rising.slice(0, limit);
}

/**
 * Get restaurants that are losing hype (falling stars)
 */
export function getFallingStars(restaurants, limit = 3) {
  if (!restaurants || restaurants.length === 0) {
    return [];
  }

  const restaurantsWithMomentum = restaurants.map(r => {
    const trendData = generateTrendData(r);
    return {
      ...r,
      momentum: calculateMomentum(trendData),
    };
  });

  // Filter for negative momentum and sort
  const falling = restaurantsWithMomentum
    .filter(r => r.momentum < -5)
    .sort((a, b) => a.momentum - b.momentum);

  return falling.slice(0, limit);
}