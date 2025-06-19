"use server";
import { z } from "zod";
import { prisma } from "@/lib/client/prisma";
import { addressZodSchema } from "@/schemas/account/address";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { revalidatePath } from "next/cache";
import { Province } from "@/lib/generated/prisma";

export type UserAddress = z.infer<typeof addressZodSchema> & { id: string };

// fetch all existing
export async function getUserAddressesAction(): Promise<{
  success: boolean;
  message: string;
  addresses?: UserAddress[];
  error?: string;
}> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return {
      success: false,
      message: "Authentication required.",
      error: "Authentication required.",
    };
  }

  try {
    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      message: "Addresses fetched successfully.",
      addresses: addresses as UserAddress[],
    };
  } catch (error) {
    console.error("Error fetching user addresses:", error);
    return {
      success: false,
      message: "Failed to fetch addresses.",
      error: "Failed to fetch addresses.",
    };
  }
}

// create new

export async function createNewAddressAction(
  data: z.infer<typeof addressZodSchema>
): Promise<{
  success: boolean;
  message: string;
  address?: UserAddress;
  error?: string;
}> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return {
      success: false,
      message: "Authentication required.",
      error: "Authentication required.",
    };
  }

  try {
    const validated = addressZodSchema.parse(data);

    if (validated.isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: user.id,
          isDefault: true,
        },
        data: { isDefault: false },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId: user.id,
        ...validated,
        province: validated.province as Province,
      },
    });

    revalidatePath("/account/addresses");
    revalidatePath("/checkout");

    return {
      success: true,
      message: "Address created successfully.",
      address: newAddress as UserAddress,
    };
  } catch (error) {
    console.error("Error creating address:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation error.",
        error: `Validation error: ${error.errors
          .map((e) => e.message)
          .join(", ")}`,
      };
    }
    return {
      success: false,
      message: "Failed to create new address.",
      error: "Failed to create new address.",
    };
  }
}

// update

export async function updateAddressAction(
  addressId: string,
  data: z.infer<typeof addressZodSchema>
): Promise<{
  success: boolean;
  message: string;
  address?: UserAddress;
  error?: string;
}> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return {
      success: false,
      message: "Authentication required.",
      error: "Authentication required.",
    };
  }

  try {
    const validated = addressZodSchema.parse(data);

    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address || address.userId !== user.id) {
      return {
        success: false,
        message: "Unauthorized or address not found.",
        error: "Unauthorized or address not found.",
      };
    }

    if (validated.isDefault) {
      await prisma.address.updateMany({
        where: {
          userId: user.id,
          isDefault: true,
          // Don't unset the current address if it's already default
          NOT: { id: addressId },
        },
        data: { isDefault: false },
      });
    }

    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: {
        ...validated,
        province: validated.province as Province,
      },
    });

    revalidatePath("/account/addresses");
    revalidatePath("/checkout");

    return {
      success: true,
      message: "Address updated successfully.",
      address: updatedAddress as UserAddress,
    }; // Cast to UserAddress
  } catch (error) {
    console.error("Error updating address:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Validation error.",
        error: `Validation error: ${error.errors
          .map((e) => e.message)
          .join(", ")}`,
      };
    }
    return {
      success: false,
      message: "Failed to update address.",
      error: "Failed to update address.",
    };
  }
}

// delete

export async function deleteAddressAction(
  addressId: string
): Promise<{ success: boolean; message: string; error?: string }> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return {
      success: false,
      message: "Authentication required.",
      error: "Authentication required.",
    };
  }

  try {
    const address = await prisma.address.findUnique({
      where: { id: addressId },
    });

    if (!address || address.userId !== user.id) {
      return {
        success: false,
        message: "Unauthorized or address not found.",
        error: "Unauthorized or address not found.",
      };
    }

    await prisma.address.delete({
      where: {
        id: addressId,
      },
    });

    revalidatePath("/account/addresses");
    revalidatePath("/checkout");

    return { success: true, message: "Address deleted successfully." };
  } catch (error) {
    console.error("Error deleting address:", error);
    return {
      success: false,
      message: "Failed to delete address.",
      error: "Failed to delete address.",
    };
  }
}
// default

export async function setDefaultAddressAction(
  addressId: string
): Promise<{ success: boolean; message: string; error?: string }> {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return {
      success: false,
      message: "Authentication required.",
      error: "Authentication required.",
    };
  }

  try {
    const addressToSetDefault = await prisma.address.findUnique({
      where: { id: addressId, userId: user.id },
    });

    if (!addressToSetDefault) {
      return {
        success: false,
        message: "Address not found or does not belong to user.",
        error: "Address not found or does not belong to user.",
      };
    }

    await prisma.address.updateMany({
      where: {
        userId: user.id,
        isDefault: true,
        NOT: { id: addressId },
      },
      data: { isDefault: false },
    });

    await prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });

    revalidatePath("/account/addresses");
    revalidatePath("/checkout");

    return { success: true, message: "Default address set successfully." };
  } catch (error) {
    console.error("Error setting default address:", error);
    return {
      success: false,
      message: "Failed to set default address.",
      error: "Failed to set default address.",
    };
  }
}
