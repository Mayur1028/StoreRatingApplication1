const bcrypt = require("bcryptjs");

async function fixAdmin() {
  const password = "Admin@123";
  const hash = await bcrypt.hash(password, 10);
  console.log("Correct hash for Admin@123:");
  console.log(hash);

  // Test the hash
  const isValid = await bcrypt.compare("Admin@123", hash);
  console.log("Hash validation test:", isValid);
}

fixAdmin();
