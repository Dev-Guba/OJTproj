import bcrypt from "bcrypt";

async function run() {
  const plainPassword = "admin123"; // the password you want
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  console.log("Hashed password:", hashedPassword);
}

run();
