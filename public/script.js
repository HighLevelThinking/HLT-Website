async function handleLogin(button) {
    const output = document.getElementById("result");
    const username = document.getElementById("uname").value;
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
        output.innerHTML = "Server error: " + err;
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

async function handleAddition(button){
    const output = document.getElementById("result");
    const username = document.getElementById("uname").value.trim();
    const password = document.getElementById("pass").value;
    const passwordConfirm = document.getElementById("pass-conf").value;
    const email = document.getElementById("email").value;

    // Reset message
    output.innerHTML = "";
    output.className = "";

    if (!username) {
        output.innerHTML = "Please enter username.";
        output.classList.add("error");
        return;
    } else if (!password || !passwordConfirm) {
        output.innerHTML = "Please enter password and password confirmation.";
        output.classList.add("error");
        return;
    } else if (!email) {
        output.innerHTML = "Please enter email.";
        output.classList.add("error");
        return;
    }

    if (password != passwordConfirm) {
        output.innerHTML = "Passwords are not the same.";
        output.classList.add("error");
    }

    // Animation
    button.classList.add("submit");
    setTimeout(() => button.classList.remove("submit"), 400);

    console.log('username ', username, ' password ', password, ' email', email)

    try {
    const response = await fetch('http://localhost:3000/adduser', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, email })
    });

    const result = await response.json();

    if (result.success) {
        output.innerHTML = `Added, ${username}!`;
        output.classList.add("success");
    } else {
        output.innerHTML = result.message + '.';
        output.classList.add("error");
        button.classList.add("jump");
        setTimeout(() => button.classList.remove("jump"), 400);
    }
    } catch (err) {
        console.error(err);
        output.innerHTML = "Server error: " + err;
        output.classList.add("error");
    }
}

//todo: add function to add <li> with username, password, and remove account button
async function loadUsers() {
  const table = document.querySelector("table");

  const res = await fetch('http://localhost:3000/get-users', {
    credentials: 'include'
  });

  const result = await res.json();
  if (!result.success) return;

  const users = result.users;

  // Build rows and append
  users.forEach(user => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td>${user.name}</td>
      <td>${user.level}</td>
      <td><button onclick="removeUser(${user.id})">Remove</button></td>
    `;
    table.appendChild(row);
  });
}

async function removeUser(id) {
  try {
    const response = await fetch('http://localhost:3000/adduser', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({id})
    });
    if (response.status) {
        alert("Server error, could not remove.");
    } else {
        alert(`Removed user with id of ${id}.`);
    }
  } catch (err) {
    alert(`Error: ${err}`);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  loadUsers();
});