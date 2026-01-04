import './Works.css'
import { useLanguage } from '../../context/LanguageContext'

function Works() {
  const { t } = useLanguage()
  
  const translatedProjects = t('works.projects')
  const projects = Array.isArray(translatedProjects) 
    ? translatedProjects.map((project, index) => ({
        ...project,
        image: `https://picsum.photos/600/400?random=${index + 1}`
      }))
    : []

  return (
    <section id="works" className="works-section">
      <div className="works-content">
        <h2 className="works-title">{t('works.title')}</h2>
        <p className="works-subtitle">
          {t('works.subtitle')}
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

