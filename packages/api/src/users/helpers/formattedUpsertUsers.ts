import * as bcrypt from 'bcrypt';

const hashPassword = (password) => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};

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
            a?.uniqueId ?? null,
            a?.userUniqueId ?? null,
            a?.id ?? null,
            a?.streetAddress === undefined ? '$undefined$' : a.streetAddress,
            a?.locality === undefined ? '$undefined$' : a.locality,
            a?.region === undefined ? '$undefined$' : a.region,
            a?.postalCode === undefined ? '$undefined$' : a.postalCode,
            a?.country === undefined ? '$undefined$' : a.country,
            a?.userId === undefined ? '$undefined$' : a.userId,
            a?.isActive === undefined ? '$undefined$' : a.isActive,
            a?.isArchived === undefined ? '$undefined$' : a.isArchived,
          ],
        ],
        localAccu[1],
      ) || localAccu[1];

    return [
      [
        ...localAccu[0],
        [
          u?.uniqueId ?? null,
          u?.id ?? null,
          u?.password === undefined ? '$undefined$' : hashPassword(u.password),
          u?.givenName === undefined ? '$undefined$' : u.givenName,
          u?.familyName === undefined ? '$undefined$' : u.familyName,
          u?.middleName === undefined ? '$undefined$' : u.middleName,
          u?.nickname === undefined ? '$undefined$' : u.nickname,
          u?.preferredUsername === undefined
            ? '$undefined$'
            : u.preferredUsername,
          u?.profile === undefined ? '$undefined$' : u.profile,
          u?.picture === undefined ? '$undefined$' : u.picture,
          u?.website === undefined ? '$undefined$' : u.website,
          u?.email === undefined ? '$undefined$' : u.email,
          u?.emailVerified === undefined ? '$undefined$' : u.emailVerified,
          u?.gender === undefined ? '$undefined$' : u.gender,
          u?.birthdate === undefined ? '$undefined$' : u.birthdate,
          u?.zoneinfo === undefined ? '$undefined$' : u.zoneinfo,
          u?.locale === undefined ? '$undefined$' : u.locale,
          u?.phoneNumber === undefined ? '$undefined$' : u.phoneNumber,
          u?.phoneNumberVerified === undefined
            ? '$undefined$'
            : u.phoneNumberVerified,
          u?.isActive === undefined ? '$undefined$' : u.isActive,
          u?.isArchived === undefined ? '$undefined$' : u.isArchived,
        ],
      ],
      add,
    ];
  }, Promise.resolve([[[null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]], [[null, null, null, null, null, null, null, null, null, null, null]]]));
};
