import { rewardByFrequency } from "@/constants/rewardByFrequency";

interface GetRewardByFrequencyParams {
    sequentialDays: string;
    firstAccess?: boolean;
}

export function getRewardByFrequency({
    sequentialDays,
    firstAccess = false,
}: GetRewardByFrequencyParams) {
    if (firstAccess) {
        return rewardByFrequency.firstAccess;
    }

    const completedAMonth = Number(sequentialDays) % 30;

    if (completedAMonth === 0) {
        return rewardByFrequency["30"];
    }

    return Number(sequentialDays) >= 7
        ? rewardByFrequency["7"]
        : rewardByFrequency[sequentialDays];
}
