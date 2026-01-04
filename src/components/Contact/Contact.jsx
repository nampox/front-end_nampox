import './Contact.css'
import { useLanguage } from '../../context/LanguageContext'

function Contact() {
  const { t } = useLanguage()
  
  return (
    <section id="contact" className="contact-section">
      <div className="contact-content">
        <h2 className="contact-title">{t('contact.title')}</h2>
        <p className="contact-subtitle">
          {t('contact.subtitle')}
        </p>
        <form className="contact-form">
          <div className="form-row">
            <div className="form-group">
              <input type="text" placeholder={t('contact.namePlaceholder')} required />
            </div>
            <div className="form-group">
              <input type="email" placeholder={t('contact.emailPlaceholder')} required />
            </div>
          </div>
          <div className="form-group">
            <input type="text" placeholder={t('contact.subjectPlaceholder')} />
          </div>
          <div className="form-group">
            <textarea placeholder={t('contact.messagePlaceholder')} rows="5" required></textarea>
          </div>
          <button type="submit" className="submit-btn">{t('contact.submitButton')}</button>
        </form>
      </div>
    </section>
  )
}

export default Contact

