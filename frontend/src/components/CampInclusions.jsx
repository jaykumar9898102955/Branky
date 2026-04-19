import React from 'react';

const CampInclusions = () => {
  const inclusions = [
    {
      title: 'Live Interactive Sessions',
      desc: 'Hands-on learning with expert mentors in real-time.',
      icon: '↗️'
    },
    {
      title: 'Gamified Learning Modules',
      desc: 'Engaging content that makes STEM concepts fun and easy.',
      icon: '↗️'
    },
    {
      title: 'Build 15+ STEM Projects',
      desc: 'Take home tangible projects and creations built by you.',
      icon: '↗️'
    },
    {
      title: 'Certification upon Completion',
      desc: 'Recognized certificate to showcase your skills.',
      icon: '↗️'
    }
  ];

  return (
    <section className="inc-section">
      <div className="inc-grid-bg"></div>
      <div className="camp-container">
        <h2 className="camp-heading" style={{ color: 'white', marginBottom: '60px' }}>
          WHAT'S <span className="highlight">INCLUDED</span> IN THE CAMP?
        </h2>

        <div className="inc-layout">
          <div className="inc-image">
            <img src="/child-stem.png" alt="Happy student" />
            {/* Note: I'm using a placeholder path. If user has it, they can replace. */}
          </div>

          <div className="inc-cards">
            {inclusions.map((inc, i) => (
              <div key={i} className="inc-card">
                <div className="icon">
                  <span style={{ color: 'white', transform: 'rotate(-45deg)', display: 'inline-block' }}>➜</span>
                </div>
                <h4>{inc.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CampInclusions;
