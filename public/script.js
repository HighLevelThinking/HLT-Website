async function handleLogin(button) {
    const output = document.getElementById("result");
    const username = document.getElementById("uname").value.trim();
    const password = document.getElementById("pass").value;

    // Reset message
    output.innerHTML = "";
    output.className = "";

    if (!username || !password) {
    output.innerHTML = "Please enter username and password.";
    output.classList.add("error");
    return;
    }

    // Animation
    button.classList.add("submit");
    setTimeout(() => button.classList.remove("submit"), 400);

    try {
    const response = await fetch('http://localhost:3000/check-user', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();

    if (result.success) {
        output.innerHTML = `Welcome back, ${username}!`;
        output.classList.add("success");
    } else {
        output.innerHTML = result.message || "incorrect username or password";
        output.classList.add("error");
        button.classList.add("jump");
        setTimeout(() => button.classList.remove("jump"), 400);
    }
    } catch (err) {
    console.error(err);
    output.innerHTML = "Server error";
    output.classList.add("error");
    }
}

window.onload = async () => {
  const res = await fetch('http://localhost:3000/is-signed-in', {
    credentials: 'include'
  });
  const result = await res.json();
  if (!result.success) {
    document.getElementById('secretBox').style.display = 'none';
  } else {
    document.getElementById('loginButton').style.display = 'none';
  }
};

function showPopup() {
  document.getElementById("popup").style.display = "block";
}

function hidePopup() {
  document.getElementById("popup").style.display = "none";
}