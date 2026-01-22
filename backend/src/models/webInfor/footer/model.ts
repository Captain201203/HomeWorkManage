import mongoose, {Document, Schema} from "mongoose";

export interface IFooter extends Document{
    companyName: string;
    companyAddress: string;
    companyPhone: string;
    companyEmail: string;

}

export const FooterSchema: Schema = new Schema({
    companyName: {type: String, required: true},
    companyAddress: {type: String, required: true},
    companyPhone: {type: String, required: true},
    companyEmail: {type: String, required: true},
});

export default mongoose.models.Footer || mongoose.model<IFooter>('Footer', FooterSchema);