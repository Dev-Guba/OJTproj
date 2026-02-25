import bcrypt from 'bcrypt';

const password = "admin123";
const hashedpassword = await bcrypt.hash(password,10);

console.log(hashedpassword);