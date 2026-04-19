import React from 'react';
import { RiArrowRightUpLongLine } from "react-icons/ri";

const CampObjectives = () => {
  const objectives = [
    {
      title: 'ROBOTICS & CODING',
      desc: 'Master the fundamentals of robotics engineering and visual block-based coding.',
      icon: < RiArrowRightUpLongLine />
    },
    {
      title: 'CRITICAL THINKING',
      desc: 'Enhance problem-solving skills through hands-on STEM challenges and missions.',
      icon: < RiArrowRightUpLongLine />
    },
    {
      title: 'COLLABORATION',
      desc: 'Work in teams to develop projects, fostering communication and leadership.',
      icon: < RiArrowRightUpLongLine />
    },
    {
      title: 'INNOVATION',
      desc: 'Brainstorm and build creative solutions for real-world scenarios.',
      icon: < RiArrowRightUpLongLine />
    },
    {
      title: 'PRESENTATION',
      desc: 'Showcase final projects to peers and mentors, building confidence.',
      icon: < RiArrowRightUpLongLine />
    }
  ];

  return (
    <section className="camp-section">
      <div className="camp-container">
        <h2 className="camp-heading">
          AT <span className="highlight">RFL SUMMER CAMP 2026,</span> <br />
          YOUR CHILD WILL
        </h2>

        <div className="obj-grid">
          {objectives.map((obj, i) => (
            <div key={i} className="obj-card">
              <div className="obj-icon">{obj.icon}</div>
              <h4>{obj.title}</h4>
              <p>{obj.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button className="btn-primary" style={{ padding: '16px 48px', fontSize: '18px' }}>
            REGISTER NOW
          </button>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '60px 0 0' }} />
      </div>
    </section>
  );
};

export default CampObjectives;
