import { restaurants } from "../data/restaurants";
import RestaurantCard from "../components/RestaurantCard";

function Home() {
  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Kochi Restaurants</h2>
          <p style={styles.subtitle}>Community-verified · Hype vs Reality</p>
        </div>

        <div style={styles.grid}>
          {restaurants.map((place) => (
            <RestaurantCard key={place.id} restaurant={place} />
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    background: "#f3f4f6",
    paddingBottom: 40,
  },
  container: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "32px 24px",
  },
  header: {
    marginBottom: 28,
  },
  title: {
    margin: 0,
    fontSize: 26,
    fontWeight: 800,
    color: "#111",
  },
  subtitle: {
    margin: "4px 0 0",
    fontSize: 14,
    color: "#9ca3af",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: 20,
  },
};

export default Home;