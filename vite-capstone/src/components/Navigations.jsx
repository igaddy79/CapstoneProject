import { Link }  from 'react-router-dom';
import './Navigations.css';

export default function Navigations() {
    {/* insert logout button if token is present / if user is already logged in */}

    return (
        <nav className="navbar">
            <div className="links">
                <Link className="link" to="/movies">Home</Link>
                {/* insert routes to sign up and login here */}
                <Link className="link">Sign Up</Link>
                <Link className="link">Log In</Link>
            </div>
        </nav>
    )
}