import './Footer.css';
import fssai from '../../assets/fssai.svg';
import Seazone from "../../assets/Seazone-dark.svg";


const Footer = () => {
    return (
        <div className="footer">
            <div className='top'>
                <div>
                <img src={Seazone} className="navbar-logo" alt="Seazone" />
                </div>
                <div>
                <p>Unveiling Luxury, Embraced by the Waves</p>
                </div>
                <div>
                    <a href="https://www.facebook.com" rel="noreferrer" target='_blank'><i className='fa-brands fa-facebook'></i></a>
                    <a href="https://www.instagram.com" rel="noreferrer" target='_blank'><i className='fa-brands fa-instagram'></i></a>
                    <a href="https://x.com" rel="noreferrer" target='_blank'><i className='fa-brands fa-x-twitter'></i></a>
                    <a href="https://www.youtube.com" rel="noreferrer" target='_blank'><i className='fa-brands fa-youtube'></i></a>
                </div>
            </div>

            <div className='bottom'>
                <div>
                <h4>All rights reserved <br></br>&copy; Seazone Hotels</h4>
                <a style={{fontSize: '12px'}} href="https://m473.netlify.app/" target="_blank" rel="noreferrer">Developed By <span style={{ color: '#d9bf61'}}>Meet Khimji Ravraiya</span></a>
                <a style={{fontSize: '12px'}} href="https://m473.netlify.app/" target="_blank" rel="noreferrer">Developed By <span style={{ color: '#d9bf61'}}>Chintan Lakhonatra</span></a>
                <a style={{fontSize: '12px'}} href="https://m473.netlify.app/" target="_blank" rel="noreferrer">Developed By <span style={{ color: '#d9bf61'}}>Mayank Desai</span></a>
                </div>

                <div>
                <img src={fssai} alt='FSSAI' className='fssai'></img>
                <p>Lisence No:</p>
                <p>01AA123456789012345</p>
                </div>

                <div className='footer-links'>
                <h4>Help</h4>
                <a href='/contact'>Support</a>
                <a href='/faqs'>FAQs</a>
                </div>

                <div>
                    <h4>Hotel Managed By</h4>
                    <p> <span style={{ color: '#d9bf61'}}>Seazone</span> group of Hotels</p>
                </div>

            </div>
        </div>
    )
}

export default Footer;