import { FiInstagram, FiYoutube } from "react-icons/fi";
import { FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { FaFacebook } from "react-icons/fa";

export default function Footer() {
  return (
    <section className="Footer">
      <div className="footer-wrapper">

        <div className="footer-top">
          <div className="footer-column">
            <div className="footer-main">
              <img width={200} src='/branky-white.png' />
              <p>Empowering innovation and creativity through cutting-edge robotics.</p>
              <h3>Corporate office</h3>
              <p>Branky, VIP Road, Vadodara - 395007</p>
            </div>
          </div>

          <div className="footer-column">
            <div className="footer-content">
              <h3>Course</h3>
              <li><a href="">Courses</a></li>
              <li><a href="">About</a></li>
              <li><a href="">Privacy Policy</a></li>
              <li><a href="">Terms and Services</a></li>
            </div>
          </div>

          <div className="footer-column">
            <div className="footer-content">
              <h3>Course</h3>
              <li><a href="">Courses</a></li>
              <li><a href="">About</a></li>
              <li><a href="">Privacy Policy</a></li>
              <li><a href="">Terms and Services</a></li>
            </div>
          </div>

          <div className="footer-column">
            <div className="footer-content">
              <h3>Course</h3>
              <li><a href="">Courses</a></li>
              <li><a href="">About</a></li>
              <li><a href="">Privacy Policy</a></li>
              <li><a href="">Terms and Services</a></li>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>Copyright ©Branky 2026 All right reserved</p>

          <div className="footer-social">
            <li><a href=""><FaLinkedin /></a></li>
            <li><a href=""><RiInstagramFill /></a></li>
            <li><a href=""><FaYoutube /></a></li>
            <li><a href=""><FaFacebook /></a></li>
          </div>
        </div>
      </div>
    </section>
  );
}