import bcrypt from "bcrypt";

async function run() {
  const plainPassword1 = "superadmin123"; // the password you want
  const hashedPassword1 = await bcrypt.hash(plainPassword1, 10);
  console.log("Hashed password for superadmin123:", hashedPassword1);

  const plainPassword2 = "admin123"; // the password you want
  const hashedPassword2 = await bcrypt.hash(plainPassword2, 10);
  console.log("Hashed password for admin123:", hashedPassword2);
}

run();
