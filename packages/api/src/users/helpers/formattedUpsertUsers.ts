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
          u?.password ?? '$undefined$',
          u?.givenName ?? '$undefined$',
          u?.familyName ?? '$undefined$',
          u?.middleName ?? '$undefined$',
          u?.nickname ?? '$undefined$',
          u?.preferredUsername ?? '$undefined$',
          u?.profile ?? '$undefined$',
          u?.picture ?? '$undefined$',
          u?.website ?? '$undefined$',
          u?.email ?? '$undefined$',
          u?.emailVerified ?? '$undefined$',
          u?.gender ?? '$undefined$',
          u?.birthdate ?? '$undefined$',
          u?.zoneinfo ?? '$undefined$',
          u?.locale ?? '$undefined$',
          u?.phoneNumber ?? '$undefined$',
          u?.phoneNumberVerified ?? '$undefined$',
          u?.isActive ?? '$undefined$',
          u?.isArchived ?? '$undefined$',
        ],
      ],
      add,
    ];
  }, Promise.resolve([[[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]], [[null, null, null, null, null, null, null, null, null, null, null]]]));
};
