const MLB_TEAMS = [
  "Arizona Diamondbacks",
  "Atlanta Braves",
  "Baltimore Orioles",
  "Boston Red Sox",
  "Chicago White Sox",
  "Chicago Cubs",
  "Cincinnati Reds",
  "Cleveland Guardians",
  "Colorado Rockies",
  "Detroit Tigers",
  "Houston Astros",
  "Kansas City Royals",
  "Los Angeles Angels",
  "Los Angeles Dodgers",
  "Miami Marlins",
  "Milwaukee Brewers",
  "Minnesota Twins",
  "New York Yankees",
  "New York Mets",
  "Oakland Athletics",
  "Philadelphia Phillies",
  "Pittsburgh Pirates",
  "San Diego Padres",
  "San Francisco Giants",
  "Seattle Mariners",
  "St. Louis Cardinals",
  "Tampa Bay Rays",
  "Texas Rangers",
  "Toronto Blue Jays",
  "Washington Nationals",
];

const NFL_TEAMS = [
  "Arizona Cardinals",
  "Atlanta Falcons",
  "Baltimore Ravens",
  "Buffalo Bills",
  "Carolina Panthers",
  "Chicago Bears",
  "Cincinnati Bengals",
  "Cleveland Browns",
  "Dallas Cowboys",
  "Denver Broncos",
  "Detroit Lions",
  "Green Bay Packers",
  "Houston Texans",
  "Indianapolis Colts",
  "Jacksonville Jaguars",
  "Kansas City Chiefs",
  "Las Vegas Raiders",
  "Los Angeles Chargers",
  "Los Angeles Rams",
  "Miami Dolphins",
  "Minnesota Vikings",
  "New England Patriots",
  "New Orleans Saints",
  "New York Giants",
  "New York Jets",
  "Philadelphia Eagles",
  "Pittsburgh Steelers",
  "San Francisco 49ers",
  "Seattle Seahawks",
  "Tampa Bay Buccaneers",
  "Tennessee Titans",
  "Washington Commanders",
];

export default function HomePage() {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Sports Card Collection</h1>
      <section style={{ marginBottom: "2rem" }}>
        <h2>MLB Teams</h2>
        <ul style={{ columns: 2, listStyle: "none", padding: 0 }}>
          {MLB_TEAMS.map((team) => (
            <li key={team} style={{ marginBottom: "0.5rem" }}>
              <a
                href={
                  team === "Arizona Diamondbacks"
                    ? "/Arizona-Diamondbacks"
                    : `/${team.replace(/ /g, "-")}`
                }
              >
                {team}
              </a>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>NFL Teams</h2>
        <ul style={{ columns: 2, listStyle: "none", padding: 0 }}>
          {NFL_TEAMS.map((team) => (
            <li key={team} style={{ marginBottom: "0.5rem" }}>
              <a href={`/${team.replace(/ /g, "-")}`}>{team}</a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
