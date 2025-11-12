import "./index.css"

function Header() {
    return(
        <header>
            <h1>HLT Website</h1>
            <ul>
                <li><button onClick={() => window.location.href = '/'}>Home</button></li>
                <li><button onClick={() => window.location.href = '/'}>About</button></li>
                <li><button onClick={() => window.location.href = '/products'}>Products</button></li>
                <li><button onClick={() => window.location.href = '/'}>Software</button></li>
                <li><button onClick={() => window.location.href = '/cart'}>Cart</button></li>
            </ul>
        </header>
    );
}

export default Header