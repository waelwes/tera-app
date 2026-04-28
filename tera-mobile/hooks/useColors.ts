import colors from "@/constants/colors";

export function useColors() {
  return { ...colors.light, radius: colors.radius };
}

export type AppColors = ReturnType<typeof useColors>;
