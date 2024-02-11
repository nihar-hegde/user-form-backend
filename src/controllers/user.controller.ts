import { Request, Response } from "express";
import { db } from "../database";
import { z } from "zod";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const userFormSchema = z.object({
  name: z.string(),
  dateOfBirth: z.coerce.date(),
  email: z.string().email(),
  phoneNumber: z.string(),
});

export const createUserForm = async (req: Request, res: Response) => {
  try {
    const validatedData = userFormSchema.safeParse(req.body);
    if (!validatedData.success) {
      console.log(validatedData.error);
    } else {
      const { name, dateOfBirth, email, phoneNumber } = validatedData.data;

      const createUserForm = await db.user.create({
        data: {
          name: name,
          dateOfBirth: dateOfBirth,
          email: email,
          phoneNumber: phoneNumber,
        },
      });
      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "noobcoding12@gmail.com",
          pass: process.env.APP_PASSWORD,
        },
      });

      const dob = new Date(createUserForm.dateOfBirth);

      const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      };

      const formatter = new Intl.DateTimeFormat("en-US", options);
      const formattedDate = formatter.format(dob);
      const mailOptions = {
        from: {
          name: "User Form",
          address: process.env.USER!,
        },
        to: createUserForm.email,
        subject: "Your Form Data",
        text: `Hi ${createUserForm.name},\n\nHere's a summary of the form data you submitted:\n\nName: ${createUserForm.name}\nDate of Birth: ${formattedDate}\nEmail: ${createUserForm.email}\nPhone Number: ${createUserForm.phoneNumber}\n\nThank you for submitting the form.`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
        } else {
          console.log("Email sent:", info.response);
        }
      });
      res.status(200).json({ message: "use created", data: createUserForm });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error while creating form" });
  }
};

export const getAllUserForms = async (req: Request, res: Response) => {
  try {
    const getAllUserFormResult = await db.user.findMany();
    res.status(200).json({ data: getAllUserFormResult });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error });
  }
};
