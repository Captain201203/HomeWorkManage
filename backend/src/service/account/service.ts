import AccountModel, { IAccount } from "../../models/account/model.js";
import bcrypt from "bcrypt";

interface IAccountService {
    getAll(): Promise<IAccount[]>;
    findByUsername(username: string): Promise<IAccount | null>;
    create(data: any): Promise<IAccount>;
}

export class AccountService implements IAccountService {
    async getAll(): Promise<IAccount[]> {
        return AccountModel.find().select('-password').exec();
    }
    async findByUsername(username: string): Promise<IAccount | null> {
        return AccountModel.findOne({ username: username });
    }

    async create(data: any): Promise<IAccount> {
            // Mã hóa mật khẩu trước khi lưu
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(data.password, salt);
            
            const newAccount = new AccountModel({
                ...data,
                password: hashedPassword
            });
            return await newAccount.save();
        }

    async update(id: string, data: Partial<IAccount>): Promise<IAccount | null> {
        return AccountModel.findOneAndUpdate({ accountId: id }, data, { new: true });
    }

    async delete(id: string): Promise<IAccount | null> {
        return AccountModel.findOneAndDelete({ accountId: id });
    }  
}