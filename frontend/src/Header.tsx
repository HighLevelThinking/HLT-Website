import "./index.css"

function Header() {
    return(
        <header>
            <h1>HLT Website</h1>
            <ul>
                <li><button onClick={() => window.location.href = 'https://www.google.com'}>Home</button></li>
                <li><button onClick={() => window.location.href = 'https://www.google.com'}>About</button></li>
                <li><button onClick={() => window.location.href = 'https://www.google.com'}>Products</button></li>
                <li><button onClick={() => window.location.href = 'https://www.google.com'}>Software</button></li>
                <li><button onClick={() => window.location.href = 'https://www.google.com'}>Cart</button></li>
            </ul>
        </header>
    );
}

export default Header