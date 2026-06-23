import { AdminCreateUserDTO, CreateUserDTO, LoginUserDTO, RoleDTO, UpdateUserDTO } from "../dtos/user.dto";
import { UserRepository } from "../repositories/user.repository";
import  bcryptjs from "bcryptjs"
import { HttpError } from "../errors/http-error";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

let userRepository = new UserRepository();

// Strip sensitive fields (password hash) from a user object before it leaves
// the service layer, so responses never disclose credentials.
function sanitizeUser(user: any) {
    if (!user) return user;
    const obj = typeof user.toObject === "function" ? user.toObject() : { ...user };
    delete obj.password;
    return obj;
}

export class UserService {
    async createUser(data: CreateUserDTO | AdminCreateUserDTO){
        const emailCheck = await userRepository.getUserByEmail(data.email);
        if(emailCheck){
            throw new HttpError(403, "Email already in use");
        }
        const usernameCheck = await userRepository.getUserByUsername(data.username);
        if(usernameCheck){
            throw new HttpError(403, "Username already in use");
        }
        const hashedPassword = await bcryptjs.hash(data.password, 10);
        data.password = hashedPassword;
        const newUser = await userRepository.createUser(data);
        return sanitizeUser(newUser);
    }

    async loginUser(data: LoginUserDTO){
        const user =  await userRepository.getUserByEmailWithPassword(data.email);
        if(!user){
            throw new HttpError(404, "User not found");
        }
        const validPassword = await bcryptjs.compare(data.password, user.password);
        if(!validPassword){
            throw new HttpError(401, "Invalid credentials");
        }
        const payload = {
            id: user._id,
            email: user.email,
            username: user.username,
            role: user.role
        }
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
        return { token, user: sanitizeUser(user) }
    }

    async getUserProfile(userId: string){
        const user = await userRepository.getUserById(userId);
        if(!user){
            throw new HttpError(404, "User not found");
        }
        return user;
    }

    async getAllUsers(){
        const users = await userRepository.getAllUsers();
        return users;
    }

    async getUsersByRole(role: string){
        const users = await userRepository.getUsersByRole(role);
        return users;
    }

    async updateUser(userId: string, updateData: Partial<UpdateUserDTO>){
        if(updateData.password){
            const hashedPassword = await bcryptjs.hash(updateData.password, 10);
            updateData.password = hashedPassword;
        }
        const updatedUser = await userRepository.updateUser(userId, updateData);
        if(!updatedUser){
            throw new HttpError(404, "User not found");
        }
        return updatedUser;
    }

    async updateUserByEmail(email: string, updateData: Partial<RoleDTO>){
        const user = await userRepository.getUserByEmail(email);
        if(!user){
            throw new HttpError(404, "User not found");
        }
        let userId = String(user._id);
        if(updateData.password){
            const hashedPassword = await bcryptjs.hash(updateData.password, 10);
            updateData.password = hashedPassword;
        }
        const updatedUser = await userRepository.updateUser(userId , updateData);
        if(!updatedUser){
            throw new HttpError(404, "User not found");
        }
        return updatedUser;
    }

    async getUserById(userId: string){
        const user = await userRepository.getUserById(userId);
        if(!user){
            throw new HttpError(404, "User not found");
        }
        return user;
    }

    async updateUserByAdmin(userId: string, updateData: Partial<UpdateUserDTO>){
        if(updateData.password){
            const hashedPassword = await bcryptjs.hash(updateData.password, 10);
            updateData.password = hashedPassword;
        }
        const updatedUser = await userRepository.updateUserByAdmin(userId, updateData);
        if(!updatedUser){
            throw new HttpError(404, "User not found");
        }
        return updatedUser;
    }
}