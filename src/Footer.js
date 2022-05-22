import { FaFacebook, FaGithub, FaInstagram } from "react-icons/fa";
import './App.css';

function Footer(){
    return(
        <footer>
            <ul className="social_list">
                <li>
                    <FaFacebook />
                </li>
                <li>
                    <FaInstagram />
                </li>
                <li>
                    <FaGithub />
                </li>
            </ul>
            <p>
                <span>Daap</span> &copy; 2022
            </p>
        </footer>
    )
}

export default Footer