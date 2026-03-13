import { useAuth } from "@/context/AuthContext";
import { storage } from "@/lib/storage";
import { useMemo } from "react";

// Returns null = access all farms (SuperAdmin), [] = no farms, [ids] = specific farms
export function useAccessibleFarmIds(): string[] | null {
  const { currentUser } = useAuth();

  return useMemo(() => {
    if (!currentUser) return [];
    const farms = storage.getFarms();
    if (currentUser.role === "SuperAdmin") return null;
    if (currentUser.role === "CompanyAdmin") {
      return farms
        .filter((f) => f.companyId === currentUser.companyId)
        .map((f) => f.id);
    }
    if (currentUser.role === "Manager") {
      const zoneFarmIds = farms
        .filter(
          (f) => f.zoneId && currentUser.assignedZoneIds?.includes(f.zoneId),
        )
        .map((f) => f.id);
      const branchFarmIds = farms
        .filter(
          (f) =>
            f.branchId && currentUser.assignedBranchIds?.includes(f.branchId),
        )
        .map((f) => f.id);
      const fromAssignment = currentUser.assignedFarmIds || [];
      return [
        ...new Set([...zoneFarmIds, ...branchFarmIds, ...fromAssignment]),
      ];
    }
    if (
      currentUser.role === "Supervisor" ||
      currentUser.role === "Dealer" ||
      currentUser.role === "Farmer"
    ) {
      return currentUser.assignedFarmIds || [];
    }
    if (currentUser.role === "Staff") {
      if (currentUser.assignedShedId) {
        const shed = storage
          .getSheds()
          .find((s) => s.id === currentUser.assignedShedId);
        return shed ? [shed.farmId] : currentUser.assignedFarmIds || [];
      }
      return currentUser.assignedFarmIds || [];
    }
    return [];
  }, [currentUser]);
}

export function filterByFarms<T extends { farmId: string }>(
  items: T[],
  accessibleFarmIds: string[] | null,
): T[] {
  if (accessibleFarmIds === null) return items;
  return items.filter((item) => accessibleFarmIds.includes(item.farmId));
}
