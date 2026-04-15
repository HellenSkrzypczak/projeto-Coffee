function init() {
  const loginLink = document.getElementById('login');
  if (loginLink) {
    loginLink.addEventListener('click', function(e) {
      e.preventDefault();
      // Handle login logic here
    });
  }
}

init();