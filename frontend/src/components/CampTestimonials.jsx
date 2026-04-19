import React from 'react';

const CampTestimonials = () => {
  const testimonials = [
    {
      quote: "This was the most exciting camp I've ever attended! I built a drone, coded my own AI, and even won a robotics challenge!",
      author: "Amir Shah, AI & Robot Camp",
      img: "/camper-1.png"
    },
    {
      quote: "My child came back inspired, confident, and more excited about STEM than ever before!",
      author: "Parent, STEM Explorer Camp",
      img: "/camper-2.png"
    }
  ];

  return (
    <section className="camp-section" style={{ backgroundColor: '#1d5ce3', padding: '100px 24px' }}>
      <div className="camp-container">
        <div className="test-section">
          <h2 className="camp-heading test-heading">
            HEAR FROM <span className="highlight">PARENTS & CAMPERS</span>
          </h2>

          <div className="test-grid">
            {testimonials.map((test, i) => (
              <div key={i} className={`test-card ${i % 2 !== 0 ? 'rev' : ''}`}>
                <div className="test-bubble">
                  <div className="test-content">
                    <p>"{test.quote}"</p>
                    <div className="test-author">{test.author}</div>
                  </div>
                </div>
                <div className="test-img">
                  <img src={test.img} alt={test.author} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .test-card.rev {
          flex-direction: row-reverse;
        }
        @media (max-width: 900px) {
          .test-card.rev {
            flex-direction: column;
          }
        }
      `}</style>
    </section>
  );
};

export default CampTestimonials;
