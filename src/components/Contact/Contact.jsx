import './Contact.css'

function Contact() {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-content">
        <h2 className="contact-title">Get In Touch</h2>
        <p className="contact-subtitle">
          Have a project in mind? Let's create something amazing together.
        </p>
        <form className="contact-form">
          <div className="form-row">
            <div className="form-group">
              <input type="text" placeholder="Your Name" required />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Your Email" required />
            </div>
          </div>
          <div className="form-group">
            <input type="text" placeholder="Subject" />
          </div>
          <div className="form-group">
            <textarea placeholder="Your Message" rows="5" required></textarea>
          </div>
          <button type="submit" className="submit-btn">Send Message</button>
        </form>
      </div>
    </section>
  )
}

export default Contact

