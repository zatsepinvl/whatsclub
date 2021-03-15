import {useAuth} from "../auth/UseAuth";
import "./Home.css";

function Home() {
    const auth = useAuth();
    const logout = () => {
        auth.logout();
    }
    return (
        <div className="home-container">
            <h4>
                Welcome, {auth.user.username}!
            </h4>
            <button className="home-logout-button" onClick={logout}>
                Logout
            </button>
        </div>
    )
}

export default Home;