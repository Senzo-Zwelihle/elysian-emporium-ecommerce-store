"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { prisma } from "@/lib/client/prisma";
import { brandZodSchema } from "@/schemas/admin/brand";

// manual auth config
const auth = process.env.AUTH;

// create new collection action
export async function createNewBrandAction(
  data: z.infer<typeof brandZodSchema>
): Promise<{ success: boolean; message: string }> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user.email !== auth) {
    return {
      success: false,
      message: "Unauthorized. Only admins can create brands.",
    };
  }

  try {
    const validated = brandZodSchema.parse(data);

    await prisma.brand.create({
      data: {
        company: validated.company,
        logo: validated.logo,
        active: validated.active === true ? true : false,
      },
    });

    return {
      success: true,
      message: "Brand created successfully.",
    };
  } catch (error) {
    console.error("Server Action Error (createNewBrandAction):", error);
    return {
      success: false,
      message: "An unexpected error occurred while creating a new brand.",
    };
  }
}

// edit existing collection action

export async function editBrandAction(
  brandId: string,
  data: z.infer<typeof brandZodSchema>
): Promise<{ success: boolean; message: string }> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user.email !== auth) {
    return {
      success: false,
      message: "Unauthorized. Only admins can edit billboards.",
    };
  }

  try {
    const validated = brandZodSchema.parse(data);

    await prisma.brand.update({
      where: {
        id: brandId,
      },
      data: {
        company: validated.company,
        logo: validated.logo,
        active: validated.active === true ? true : false,
      },
    });

    return {
      success: true,
      message: "Brand edited successfully.",
    };
  } catch (error) {
    console.error("Server Action Error (editBrandAction):", error);
    return {
      success: false,
      message: "An unexpected error occurred while updating the brand.",
    };
  }
}

// delete brand
export async function deleteBrandAction(brandId: string) {
  await prisma.brand.delete({
    where: {
      id: brandId,
    },
  });

  return redirect("/admin/brands");
}
