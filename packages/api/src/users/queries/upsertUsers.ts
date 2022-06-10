export default `
WITH left_side_users AS (
    -- Left side (comming data that represente the new users state of the db)
    SELECT
      row_number() OVER (ORDER BY uniqueId ASC) as rn,
      uniqueId,
      id,
      password,
      givenName,
      familyName,
      middleName,
      nickname,
      preferredUsername,
      profile,
      picture,
      website,
      email,
      emailVerified,
      gender,
      birthdate,
      zoneinfo,
      locale,
      phoneNumber,
      phoneNumberVerified,
      isActive::boolean,
      isArchived::boolean
    FROM (VALUES %1$L) AS v (
      uniqueId,
      id,
      password,
      givenName,
      familyName,
      middleName,
      nickname,
      preferredUsername,
      profile,
      picture,
      website,
      email,
      emailVerified,
      gender,
      birthdate,
      zoneinfo,
      locale,
      phoneNumber,
      phoneNumberVerified,
      isActive::boolean,
      isArchived::boolean
    )
  ),
  left_side_addresses AS (
    -- Left side (comming data that represente the new addresses state of the db)
    SELECT
      row_number() OVER (ORDER BY uniqueId ASC) as rn,
      uniqueId,
      userUniqueId,
      id,
      streetAddress,
      locality,
      region,
      postalCode,
      country,
      userId,
      isActive::boolean,
      isArchived::boolean
    FROM (VALUES %2$L) AS v (
      uniqueId,
      userUniqueId,
      id,
      streetAddress,
      locality,
      region,
      postalCode,
      country,
      userId,
      isActive::boolean,
      isArchived::boolean
    )
  ) SELECT * FROM left_side_users
`;
