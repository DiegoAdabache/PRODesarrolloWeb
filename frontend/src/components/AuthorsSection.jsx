export function AuthorsSection() {
  const authors = [
    {
      id: "samuel",
      name: "Orduña",
      role: "full stack",
      photoUrl: "/autores/samuel.jpg",
    },
    {
      id: "adabache",
      name: "Adabache",
      role: "backend",
      photoUrl: "/autores/adabache.jpg",
    },
    {
      id: "fede",
      name: "Fede",
      role: "frontend",
      photoUrl: "/autores/fede.jpg",
    },
  ];

  return (
    <section className="mt-4">
      <div className="d-flex justify-content-between align-items-end mb-3">
        <div>
          <h2 className="mb-0">Autores</h2>
          <div className="text-muted small">Equipo editorial</div>
        </div>
      </div>

      <div className="row g-3">
        {authors.map((a) => (
          <div className="col-12 col-md-4" key={a.id}>
            <div className="card h-100">
              <div className="card-body d-flex gap-3 align-items-center">
                <img
                  src={a.photoUrl}
                  alt={a.name}
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />
                <div className="w-100">
                  <div className="fw-bold">{a.name}</div>
                  <div className="text-muted small">{a.role}</div>

                  <a href={a.photoUrl} target="_blank" rel="noreferrer" className="small">
                    Ver foto
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
