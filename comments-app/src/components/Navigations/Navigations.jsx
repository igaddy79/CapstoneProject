import { Link }  from 'react-router-dom';
import './Navigations.css';

export default function Navigations() {
    {/* insert logout button if token is present / if user is already logged in */}

    return (
        <nav className="navbar">
            <div className="links">
                <Link className="link" to="/movies">Home</Link>
                <Link className="link" to="/signup">Sign Up</Link>
                <Link className="link" to="/login">Log In</Link>
            </div>
        </nav>
    )
}