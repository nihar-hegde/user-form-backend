import { Request, Response } from "express";
import { db } from "../database";
import { z } from "zod";

const userFormSchema = z.object({
  name: z.string(),
  dateOfBirth: z.coerce.date(),
  email: z.string().email(),
  phoneNumber: z.string(),
});

export const createUserForm = async (req: Request, res: Response) => {
  try {
    console.log(req.body, "REQ body");
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
