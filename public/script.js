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