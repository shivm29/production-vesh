import bcrypt from 'bcrypt'

export const hashPassword = async (password) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword
    }
    catch (error) { 
        console.log(error)
    }
}

// compares the password with the hashed password stored in the database when the user logins later
export const comparePassword = async (password, hashedPassword) =>  {
    return bcrypt.compare(password, hashedPassword);
}