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
                <li><img src="../assets/cart-icon.png" /></li>
            </ul>
        </header>
    );
}

export default Header