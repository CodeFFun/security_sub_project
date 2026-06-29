import { UserService } from "../services/user.service";
import { AdminCreateUserDTO, CreateUserDTO, LoginUserDTO, RoleDTO, UpdateUserDTO } from "../dtos/user.dto";
import { Request, Response } from "express";
import z from "zod";
import { DEMO_ALLOW_PRIV_ESCALATION } from "../config/security-demo";
let userService = new UserService();
export class AuthController {
    async register(req: Request, res: Response) {
        try {
            // SECURE (default): CreateUserDTO restricts role to customer/shop.
            // DEMO TOGGLE: when DEMO_ALLOW_PRIV_ESCALATION is on, the admin DTO
            // is used for the PUBLIC endpoint, re-opening mass-assignment so a
            // client can register as "admin" (privilege escalation demo).
            const schema = DEMO_ALLOW_PRIV_ESCALATION ? AdminCreateUserDTO : CreateUserDTO;
            const parsedData = schema.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json(
                    { success: false, message: z.prettifyError(parsedData.error) }
                )
            }
            const userData = parsedData.data;
            const newUser = await userService.createUser(userData);
            return res.status(201).json(
                { success: true, message: "User Created", data: newUser }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    // Admin-only: can create users with any role, including admin.
    async adminCreateUser(req: Request, res: Response) {
        try {
            const parsedData = AdminCreateUserDTO.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json(
                    { success: false, message: z.prettifyError(parsedData.error) }
                )
            }
            const newUser = await userService.createUser(parsedData.data);
            return res.status(201).json(
                { success: true, message: "User Created", data: newUser }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async login(req: Request, res: Response) {
        try {
            const parsedData = LoginUserDTO.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json(
                    { success: false, message: z.prettifyError(parsedData.error) }
                )
            }
            const loginData: LoginUserDTO = parsedData.data;
            const { token, user } = await userService.loginUser(loginData);
            return res.status(200).json(
                { success: true, message: "Login successful", data: user, token }
            );

        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await userService.getAllUsers();
            return res.status(200).json(
                { success: true, message: "Users retrieved", data: users }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async getUSersByRole(req: Request, res: Response) {
        try {
            const role = req.params.role;
            const users = await userService.getUsersByRole(role);
            return res.status(200).json(
                { success: true, message: "Users retrieved", data: users }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async getProfile(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            if (!userId) {
                return res.status(400).json(
                    { success: false, message: "User ID not found in request" }
                );
            }
            const user = await userService.getUserProfile(userId);
            return res.status(200).json(
                { success: true, message: "Profile retrieved", data: user }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const userId = req.user?._id;
            if (!userId) {
                return res.status(400).json(
                    { success: false, message: "User ID not found in request" }
                );
            }
            const parsedData = UpdateUserDTO.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json(
                    { success: false, message: z.prettifyError(parsedData.error) }
                )
            }
            if(req.file){ 
                parsedData.data.profilePictureUrl = `/uploads/${req.file.filename}`;
            }
            const updateData = parsedData.data;
            const updatedUser = await userService.updateUser(userId, updateData);
            return res.status(200).json(
                { success: true, message: "User updated", data: updatedUser }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async updateUserByEmail(req: Request, res: Response) {
        try{
            const email = req.body.email;
            const parsedData = RoleDTO.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json(
                    { success: false, message: z.prettifyError(parsedData.error) }
                )
            }
            const updateData = parsedData.data;
            const updatedUser = await userService.updateUserByEmail(email, updateData);
            return res.status(200).json(
                { success: true, message: "User updated", data: updatedUser }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async getUserById(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const user = await userService.getUserById(userId);
            return res.status(200).json(
                { success: true, message: "User retrieved", data: user }
            );
        }
        catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }

    async updateUserByAdmin(req: Request, res: Response) {
        try {
            const userId = req.params.id;
            const parsedData = UpdateUserDTO.safeParse(req.body);
            if (!parsedData.success) {
                return res.status(400).json(
                    { success: false, message: z.prettifyError(parsedData.error) }
                )
            }
            const updateData = parsedData.data;
            const updatedUser = await userService.updateUserByAdmin(userId, updateData);
            return res.status(200).json(
                { success: true, message: "User updated", data: updatedUser }
            );
        } catch (error: Error | any) {
            return res.status(error.statusCode ?? 500).json(
                { success: false, message: error.message || "Internal Server Error" }
            );
        }
    }
}