

// --------- Confirmation Function for Register --------- //

function confirmation() {
    let firstname = document.querySelector("#firstname").value;
    let lastname = document.querySelector("#lastname").value;
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;
    
    return confirm(
      `
      Is this your correct profile information?
  
      Name: ${firstname}
      Last Name: ${lastname}
      Email: ${email}
      Password: ${password}
    `
    );
  }


  // --------- Adding default profile picture if nothing is inputted --------- //
    
  var input = document.getElementById('profileimg');

  function defaultpfp() {

  if(input.value.length == 0)
      input.value = "https://www.fiaregion1.com/wp-content/uploads/2021/02/avatar-vector-male-profile-gray.jpg";

  }