// Function getting user data with address as json object and
// transform it into two array of array.
// first : array of users
// second : array of users addresses
export default async (data) => {
  return data.reduce(async (accu, u) => {
    const localAccu = await accu;
    const add =
      u?.addresses?.reduce(
        (accu2, a) => [
          ...accu2,
          [
            a.uniqueId,
            a.userUniqueId,
            a?.id ?? null,
            a?.streetAddress ?? null,
            a?.locality ?? null,
            a?.region ?? null,
            a?.postalCode ?? null,
            a?.country ?? null,
            a?.userId ?? null,
            a?.isActive ?? null,
            a?.isArchived ?? null,
          ],
        ],
        localAccu[1],
      ) || localAccu[1];

    return [
      [
        ...localAccu[0],
        [
          u.uniqueId ?? null,
          u?.id ?? null,
          u?.password ?? null,
          u?.givenName ?? null,
          u?.familyName ?? null,
          u?.middleName ?? null,
          u?.nickname ?? null,
          u?.preferredUsername ?? null,
          u?.profile ?? null,
          u?.picture ?? null,
          u?.website ?? null,
          u?.email ?? null,
          u?.emailVerified ?? null,
          u?.gender ?? null,
          u?.birthdate ?? null,
          u?.zoneinfo ?? null,
          u?.locale ?? null,
          u?.phoneNumber ?? null,
          u?.phoneNumberVerified ?? null,
          u?.isActive ?? null,
          u?.isArchived ?? null,
        ],
      ],
      add,
    ];
  }, Promise.resolve([[], []]));
};
