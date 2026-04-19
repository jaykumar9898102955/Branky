import { useState, useEffect } from 'react';
import Head from 'next/head';
import CampObjectives from '../components/CampObjectives';
import CampBatches from '../components/CampBatches';
import CampInclusions from '../components/CampInclusions';
import CampTestimonials from '../components/CampTestimonials';
import Footer from '../components/Footer';
import Modal from '../components/Modal';

// ── DATA (Required for Modal) ────────────────────────────────────────────────
const PROGRAMS = [
  { id: 'robotics', icon: '🤖', title: 'Robotics & Coding', age: 'Ages 7–14', duration: '2 Weeks', seats: 16, price: '₹8,999', desc: 'Build and program robots from scratch using Lego Mindstorms & Arduino. Logic, mechanics, teamwork.', highlights: ['Lego Mindstorms', 'Arduino Basics', 'Robot Battle Day', 'Take-Home Project'], color: '#1D5CE3' },
  { id: 'ai', icon: '🧠', title: 'AI & Machine Learning', age: 'Ages 10–16', duration: '2 Weeks', seats: 12, price: '₹9,999', desc: 'Build your own image classifier, train a chatbot, and explore how AI shapes our world.', highlights: ['Python Basics', 'Image Classification', 'ChatBot Builder', 'Ethics in AI'], color: '#FF931E' },
  { id: 'electronics', icon: '⚡', title: 'Electronics & IoT', age: 'Ages 9–15', duration: '10 Days', seats: 14, price: '₹7,499', desc: 'Build smart devices using Raspberry Pi and IoT sensors that actually do cool things.', highlights: ['Circuit Design', 'Raspberry Pi', 'Smart Home Device', 'IoT Dashboard'], color: '#1D5CE3' },
  { id: '3d', icon: '🖨️', title: '3D Design & Printing', age: 'Ages 8–14', duration: '1 Week', seats: 10, price: '₹5,999', desc: 'Learn CAD design and bring your creations to life on professional 3D printers.', highlights: ['TinkerCAD / Fusion 360', 'Print Your Design', 'Product Pitching', 'Portfolio Kit'], color: '#FF931E' },
];

export default function Home() {
  const [modal, setModal] = useState(false);
  const [pre, setPre] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const open = (p = '') => { setPre(p); setModal(true); };

  return (
    <>
      <Head>
        <title>RFL Summer Camp 2026 | Branky STEM Labs</title>
        <meta name="description" content="Join the most exciting STEM summer camp of 2026. Robotics, AI, Coding, and more!" />
      </Head>

      {/* RESTORED HERO SECTION */}
      <section className='Hero'>
        <div className='hero-wrapper'>
          <div className='hero-head'>
            <div className='hero-logo'>
              <img src='/branky-white.png' alt="Branky Logo" />
            </div>

            <div className='hero-nav'>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#programs">Programs</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#register">Register</a></li>
            </div>
          </div>

          <div className='hero-main'>
            <div className='hero-content'>
              <p>A summer of <strong> tech, fun <br/> & future-ready skills </strong> </p>
              <img src='' alt="" />
              <p>Courses starting at just <strong> Rs.1299 </strong> </p>
            </div>

            <div className='hero-form'>
              <form onSubmit={(e) => { e.preventDefault(); open(); }}>
                <input type="text" placeholder='Parents Name' required />
                <input type="text" placeholder='Student Name' required />
                <input type="text" placeholder='Student Age' required />
                <input type="text" placeholder='Phone Number' required />
                <input type="text" placeholder='School Name' />
                <input type="text" placeholder='City' />
                <button type='submit' className='submit-btn'>Register Now</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <main>
        {/* Objectives Section */}
        <CampObjectives />

        {/* Batches Section */}
        <CampBatches />

        {/* Inclusions Section */}
        <CampInclusions />

        {/* Testimonials Section */}
        <CampTestimonials />
      </main>

      {/* RESTORED FOOTER & MODAL */}
      <Footer />
      <Modal open={modal} onClose={() => setModal(false)} pre={pre} programs={PROGRAMS} />
    </>
  );
}
