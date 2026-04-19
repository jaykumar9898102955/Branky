import React from 'react';

const CampBatches = () => {
  const foundationData = [
    { age: '6-7', theme: 'Mini Makers', skills: 'Basic robotics, logic building, and Minecraft code.', price: '₹1299' },
    { age: '8-9', theme: 'Tech Tinkers', skills: 'Game development and LEGO Wizbot dynamics.', price: '₹1299' },
    { age: '10-14', theme: 'Robo Explorers', skills: 'Solar-powered robotics and based automation.', price: '₹1299' },
    { age: '15-18', theme: 'Innovators in Action', skills: 'Electronic IoT, and face recognition technology.', price: '₹1299' }
  ];

  const advancedData = [
    { age: '6-7', theme: 'Little Makers', skills: 'Basic engineering concepts, coding with Scratch Junior, and robotics activity.', price: '₹8999' },
    { age: '8-9', theme: 'Junior Engineers', skills: 'Pro robotics concepts, AI-driven games, and mechanical engineering basics.', price: '₹8999' },
    { age: '10-14', theme: 'Tech Trailblazers', skills: 'Advanced robotics, 3D printing, app development, and introductory drone operation.', price: '₹8999' },
    { age: '15-18', theme: 'Future Innovators', skills: 'IoT fundamentals, Python programming, robotics engineering, advanced 3D printing, and drone technology.', price: '₹8999' }
  ];

  return (
    <section className="camp-section" style={{ backgroundColor: '#f7f9ff' }}>
      <div className="camp-container">
        <div className="camp-dark-section">
          <h2 className="camp-heading" style={{ color: 'white' }}>
            MULTIPLE BATCHES <span className="highlight">AVAILABLE</span> <br />
            TO FIT YOUR SUMMER SCHEDULE
          </h2>

          <div className="batch-table-container">
            <div className="batch-section-title">
              <h3>FOUNDATION ROBOTICS CAMP (3-DAY)</h3>
              <p>Perfect for beginners — A fun, hands-on introduction to STEM.</p>
            </div>
            
            <table className="camp-table">
              <thead>
                <tr>
                  <th>AGE</th>
                  <th>THEME</th>
                  <th>SKILLS</th>
                  <th>PRICE</th>
                </tr>
              </thead>
              <tbody>
                {foundationData.map((row, i) => (
                  <tr key={i}>
                    <td className="t-age">{row.age}</td>
                    <td className="t-theme">{row.theme}</td>
                    <td className="t-skills">{row.skills}</td>
                    <td className="t-price">{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="batch-section-title">
              <h3>ADVANCED AI & ROBOTICS CAMP (10-DAY)</h3>
              <p>For young innovators — Take robotics and AI to the next level with advanced projects.</p>
            </div>
            
            <table className="camp-table">
              <thead>
                <tr>
                  <th>AGE</th>
                  <th>THEME</th>
                  <th>SKILLS</th>
                  <th>PRICE</th>
                </tr>
              </thead>
              <tbody>
                {advancedData.map((row, i) => (
                  <tr key={i}>
                    <td className="t-age">{row.age}</td>
                    <td className="t-theme">{row.theme}</td>
                    <td className="t-skills">{row.skills}</td>
                    <td className="t-price">{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="batch-actions">
              <div className="batch-cta-text">
                GET FUTURE-READY WITH HANDS-ON LEARNING
              </div>
              <button className="btn-download">
                DOWNLOAD BROCHURE
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CampBatches;
