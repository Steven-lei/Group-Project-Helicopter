import { useQueryGroup } from "../hooks/useQueryGroup";
import { useNavigate } from "react-router-dom";
const styles = {
  container: {
    padding: "20px",
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    boxSizing: "border-box",
    display: "block",
  },
  title: { textAlign: "center", marginBottom: "30px", color: "#333" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "20px",
    justifyContent: "center",
    width: "100%",
    flexDirection: "unset",
    justifyContent: "center",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "15px",
    textAlign: "center",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    transition: "transform 0.2s",
    backgroundColor: "#fff",
    maxWidth: "280px",
  },
  avatarContainer: { marginBottom: "15px" },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #eee",
  },
  name: { fontSize: "1.2rem", margin: "10px 0 5px" },
  role: { color: "#666", fontSize: "0.9rem", marginBottom: "10px" },
  genderTag: {
    padding: "2px 8px",
    borderRadius: "12px",
    fontSize: "0.75rem",
    color: "#fff",
    textTransform: "capitalize",
  },
};
export function Group() {
  const { data: result, isLoading, isError, error } = useQueryGroup();
  console.log(result);
  const navigate = useNavigate();
  if (isLoading) return <div className="loading">Loading...</div>;
  if (isError) return <div className="error">Error: {error.message}</div>;

  return (
    <section style={styles.container}>
      <h2 style={styles.title}>Group Members</h2>

      <div style={styles.grid}>
        {result.data.map((member) => (
          <div
            key={member.id}
            style={styles.card}
            onClick={() => navigate(`/member/${member.id}`)}
          >
            <div style={styles.avatarContainer}>
              <img
                src={
                  member.avatar_url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random&color=fff`
                }
                alt={member.name}
                style={styles.avatar}
              />
            </div>
            <div style={styles.info}>
              <h3 style={styles.name}>{member.name}</h3>
              <p style={styles.role}>{member.role}</p>
              <span
                style={{
                  ...styles.genderTag,
                  backgroundColor:
                    member.gender === "female" ? "#ff7eb9" : "#7eb9ff",
                }}
              >
                {member.gender === "female" ? "♀" : "♂"} {member.gender}
              </span>
            </div>
          </div>
        ))}
      </div>

      {result.data.length === 0 && <p>No data</p>}
    </section>
  );
}
