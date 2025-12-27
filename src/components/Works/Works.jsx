import './Works.css'

function Works() {
  const projects = [
    {
      id: 1,
      title: 'Project Alpha',
      category: 'Web Design',
      image: 'https://picsum.photos/600/400?random=1'
    },
    {
      id: 2,
      title: 'Project Beta',
      category: 'Branding',
      image: 'https://picsum.photos/600/400?random=2'
    },
    {
      id: 3,
      title: 'Project Gamma',
      category: 'UI/UX Design',
      image: 'https://picsum.photos/600/400?random=3'
    },
    {
      id: 4,
      title: 'Project Delta',
      category: 'Development',
      image: 'https://picsum.photos/600/400?random=4'
    }
  ]

  return (
    <section id="works" className="works-section">
      <div className="works-content">
        <h2 className="works-title">Our Works</h2>
        <p className="works-subtitle">
          Explore our latest projects and creative solutions
        </p>
        <div className="works-grid">
          {projects.map((project) => (
            <div key={project.id} className="work-card">
              <div className="work-image">
                <img src={project.image} alt={project.title} />
                <div className="work-overlay">
                  <span className="work-category">{project.category}</span>
                  <h3 className="work-name">{project.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Works

