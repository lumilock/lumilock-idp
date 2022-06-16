export default `
    WITH left_side_users AS (
    -- Left side (comming data that represente the new users state of the db)
    SELECT
      row_number() OVER (ORDER BY unique_id ASC) as rn,
      unique_id,
      id::uuid,
      password,
      given_name,
      family_name,
      middle_name,
      nickname,
      preferred_username,
      profile,
      picture,
      website,
      TRIM(email) as email,
      email_verified,
      gender,
      birthdate,
      zoneinfo,
      locale,
      phone_number,
      phone_number_verified,
      is_active,
      is_archived
    FROM (VALUES %1$L) AS v (
      unique_id,
      id,
      password,
      given_name,
      family_name,
      middle_name,
      nickname,
      preferred_username,
      profile,
      picture,
      website,
      email,
      email_verified,
      gender,
      birthdate,
      zoneinfo,
      locale,
      phone_number,
      phone_number_verified,
      is_active,
      is_archived
    ) WHERE unique_id IS NOT NULL
  ),
  left_side_addresses AS (
    -- Left side (comming data that represente the new addresses state of the db)
    SELECT
      row_number() OVER (ORDER BY unique_id ASC) as rn,
      unique_id,
      user_unique_id,
      id,
      street_address,
      locality,
      region,
      postal_code,
      country,
      user_id,
      is_active::boolean,
      is_archived::boolean
    FROM (VALUES %2$L) AS v (
      unique_id,
      user_unique_id,
      id,
      street_address,
      locality,
      region,
      postal_code,
      country,
      user_id,
      is_active,
      is_archived
    ) WHERE unique_id IS NOT NULL
  ),
  right_side_users AS (
    -- Right side (db data)
    SELECT uc.id as subject_id, u.* FROM users u
    LEFT JOIN users_clients uc ON u.id = uc.user_id
    WHERE uc.client_id = %3$L::uuid  AND u.id in (SELECT lsu.id from left_side_users lsu WHERE lsu.id IS NOT null) -- we only want affect data that comes from parameters
  ),
  to_insert_users_v1 AS (
    -- Part that is only on the left side (incoming data we want to insert)
    SELECT
      ls.rn,
      NULLIF(ls.unique_id, '$undefined$') as unique_id,
      ls.id,
      NULLIF(ls.password, '$undefined$') as password,
      NULLIF(ls.given_name, '$undefined$') as given_name,
      NULLIF(ls.family_name, '$undefined$') as family_name,
      NULLIF(ls.middle_name, '$undefined$') as middle_name,
      NULLIF(ls.nickname, '$undefined$') as nickname,
      NULLIF(ls.preferred_username, '$undefined$') as preferred_username,
      NULLIF(ls.profile, '$undefined$') as profile,
      NULLIF(ls.picture, '$undefined$') as picture,
      NULLIF(ls.website, '$undefined$') as website,
      NULLIF(ls.email, '$undefined$') as email,
      NULLIF(ls.email_verified, '$undefined$') as email_verified,
      NULLIF(ls.gender, '$undefined$') as gender,
      NULLIF(ls.birthdate, '$undefined$') as birthdate,
      NULLIF(ls.zoneinfo, '$undefined$') as zoneinfo,
      NULLIF(ls.locale, '$undefined$') as locale,
      NULLIF(ls.phone_number, '$undefined$') as phone_number,
      NULLIF(ls.phone_number_verified, '$undefined$') as phone_number_verified,
      NULLIF(ls.is_active, '$undefined$') as is_active,
      NULLIF(ls.is_archived, '$undefined$') as is_archived
    FROM left_side_users ls
    LEFT JOIN right_side_users rs ON ls.id = rs.subject_id
    WHERE rs.subject_id IS NULL -- so here we only get rows where rs.id is NULL because it's data we want to insert
    ORDER BY ls.unique_id ASC
  ),
  login_to_insert_formatted AS (
    SELECT
      u.rn,
      u.unique_id,
      lc_gn,
      lc_fn,
      CONCAT(lc_gn, '.', lc_fn) AS base_login
    FROM to_insert_users_v1 u
    JOIN (
      SELECT
      REGEXP_REPLACE(unaccent(LOWER(u2.given_name)), '([^\\w]+| |-|_|\\.)+', '-', 'gi') as lc_gn,
      REGEXP_REPLACE(unaccent(LOWER(u2.family_name)), '([^\\w]+| |-|_|\\.)+', '-', 'gi') as lc_fn,
      u2.unique_id
      FROM to_insert_users_v1 u2
      ) u3 ON u3.unique_id = u.unique_id
  ),
  login_to_insert_number AS (
    SELECT
      l.*,
      (
        SELECT MAX(COALESCE(NULLIF(REPLACE(u4.login, l.base_login, ''), '')::integer, 0))
        FROM users u4
        WHERE u4.login ~ CONCAT('^', l.base_login, '[0-9]*')
      ) AS login_number_in_db,
      (
        SELECT new_order.rn2 as login_number_to_insert
        FROM (
          SELECT row_number() OVER (ORDER BY l2.rn ASC) as rn2, l2.rn, l2.unique_id
          FROM login_to_insert_formatted l2
          WHERE l2.base_login = l.base_login
        ) new_order
        WHERE new_order.unique_id = l.unique_id
      )
    FROM login_to_insert_formatted l
  ),
  to_insert_users AS (
    -- Part that is only on the left side (incoming data we want to insert)
    SELECT ti.*, login FROM to_insert_users_v1 ti
    JOIN (
      SELECT
        CONCAT(
          ltin.base_login,
          COALESCE(NULLIF(COALESCE(ltin.login_number_in_db, 0) + ltin.login_number_to_insert, 1)::text, '')
        ) as login,
		unique_id
      FROM login_to_insert_number ltin
    ) nb ON nb.unique_id = ti.unique_id
    ORDER BY ti.unique_id ASC
  ),
  to_delete_users AS (
    -- Part that is only on the rigth side (current db data we want to delete because their are not in the incoming data)
    SELECT ls.rn, ls.unique_id, rs.* FROM left_side_users ls
    RIGHT JOIN right_side_users rs ON ls.id = rs.subject_id
    WHERE ls.id IS NULL -- so here we only get rows where ls.id is NULL because it's data we want to remove
  ),
  to_update_users AS (
    -- Part that is common to the left and rigth side (data we want update if there are change)
    SELECT ls.*, rs.subject_id as right_side_id, rs.id as user_id FROM left_side_users ls
    INNER JOIN right_side_users rs ON ls.id = rs.subject_id
  ),
  users_updated AS (
    UPDATE users
    SET password = COALESCE(NULLIF(tuu.password, '$undefined$'), users.password),
      given_name = COALESCE(NULLIF(tuu.given_name, '$undefined$'), users.given_name),
      family_name = COALESCE(NULLIF(tuu.family_name, '$undefined$'), users.family_name),
      middle_name = COALESCE(NULLIF(tuu.middle_name, '$undefined$'), users.middle_name),
      nickname = COALESCE(NULLIF(tuu.nickname, '$undefined$'), users.nickname),
      preferred_username = COALESCE(NULLIF(tuu.preferred_username, '$undefined$'), users.preferred_username),
      profile = COALESCE(NULLIF(tuu.profile, '$undefined$'), users.profile),
      picture = COALESCE(NULLIF(tuu.picture, '$undefined$'), users.picture),
      website = COALESCE(NULLIF(tuu.website, '$undefined$'), users.website),
      email = COALESCE(NULLIF(tuu.email, '$undefined$'), users.email),
      email_verified = COALESCE(NULLIF(tuu.email_verified, '$undefined$')::boolean, users.email_verified),
      gender = COALESCE(NULLIF(tuu.gender, '$undefined$')::users_gender_enum , users.gender),
      birthdate = COALESCE(NULLIF(tuu.birthdate, '$undefined$')::date, users.birthdate),
      zoneinfo = COALESCE(NULLIF(tuu.zoneinfo, '$undefined$'), users.zoneinfo),
      locale = COALESCE(NULLIF(tuu.locale, '$undefined$'), users.locale),
      phone_number = COALESCE(NULLIF(tuu.phone_number, '$undefined$'), users.phone_number),
      phone_number_verified = COALESCE(NULLIF(tuu.phone_number_verified, '$undefined$')::boolean, users.phone_number_verified),
      is_active = COALESCE(NULLIF(tuu.is_active, '$undefined$')::boolean, users.is_active),
      is_archived = COALESCE(NULLIF(tuu.is_archived, '$undefined$')::boolean, users.is_archived)
    FROM to_update_users tuu
    WHERE tuu.user_id = users.id
    RETURNING users.id, 'UPATED' AS action, 'users' AS table
  ),
  users_deleted AS (
    UPDATE users
    SET is_archived = true,
    is_active = false
    WHERE id in (SELECT td.id FROM to_delete_users td WHERE td.is_active = true OR td.is_archived = false)
    RETURNING id, 'DISABLED' AS action, 'users' AS table
  ),
  users_ins AS (
    INSERT INTO users (
				login,
        password,
				name,
        given_name,
        family_name,
        middle_name,
        nickname,
        preferred_username,
        profile,
        picture,
        website,
        email,
        email_verified,
        gender,
        birthdate,
        zoneinfo,
        locale,
        phone_number,
        phone_number_verified,
        is_active,
        is_archived
        )
    SELECT
      login,
      COALESCE(password, login) AS password,
      REPLACE(CONCAT(given_name, ' ', middle_name, ' ', family_name), '  ', ' ') AS name,
      given_name,
      family_name,
      middle_name,
      nickname,
      preferred_username,
      profile,
      picture,
      website,
      NULLIF(email, ''),
      COALESCE(email_verified::boolean, false) AS email_verified,
      COALESCE(gender::users_gender_enum, 'other') AS gender,
      birthdate::date,
      COALESCE(zoneinfo::varchar, 'UTC') AS zoneinfo,
      COALESCE(locale::varchar, 'fr-FR') AS locale,
      phone_number,
      COALESCE(phone_number_verified::boolean, false) AS phone_number_verified,
      is_active::boolean,
      is_archived::boolean
    FROM to_insert_users ti ORDER BY ti.unique_id ASC
    RETURNING *, 'INSERTED' AS "action", 'users' AS "table"
  ),
  users_inserted AS (
    SELECT i.*, j.unique_id
    FROM (SELECT *, row_number() OVER () AS rn FROM users_ins) i
    JOIN to_insert_users j USING (rn)
  ),
  users_clients_ins AS (
  	INSERT INTO users_clients (user_id, client_id, permissions)
		SELECT ui.id AS user_id, %3$L::uuid AS client_id, '' as permissions
		FROM users_inserted ui ORDER BY ui.unique_id ASC
    RETURNING id, user_id, 'INSERTED' AS "action", 'users_clients' AS "table"
  ),
  users_clients_inserted AS (
    SELECT
      uc.id,
      u.login,
      u.name,
      u.given_name,
      u.family_name,
      u.middle_name,
      u.nickname,
      u.preferred_username,
      u.profile,
      u.picture,
      u.website,
      u.email,
      u.email_verified,
      u.gender,
      u.birthdate,
      u.zoneinfo,
      u.locale,
      u.phone_number,
      u.phone_number_verified,
      u.is_active,
      u.is_archived,
      u.unique_id,
      u.action
    FROM users_inserted u
    JOIN users_clients_ins uc ON u.id = uc.user_id
  ),
  results AS (
    SELECT * FROM users_clients_inserted
  ) SELECT * FROM results
`;

/**
 * SELECT * FROM users WHERE login ~ '^admin.admin[0-9]*';
 *
 * SELECT MAX(COALESCE(NULLIF(REPLACE(login, 'admin.admin', ''), '')::integer, 0)) + 1 AS col FROM users WHERE login ~ '^admin.admin[0-9]*';
 * SELECT * FROM users WHERE login ~ '^admin.admin[0-9]*';

SELECT MAX(COALESCE(NULLIF(REPLACE(login, 'admin.admin', ''), '')::integer, 0)) + 1 AS new_number FROM users WHERE login ~ '^admin.admin[0-9]*';

CREATE EXTENSION IF NOT EXISTS unaccent;

SELECT
  lc_gn,
  lc_fn,
  CONCAT(lc_gn, '.', lc_fn),
  CONCAT(lc_gn, '.', lc_fn),
  f_login AS col
FROM users u
JOIN (
  SELECT
    REGEXP_REPLACE(unaccent(LOWER(u2.given_name)), '([^\w]+| |-|_|\.)+', '-', 'gi') as lc_gn,
    REGEXP_REPLACE(unaccent(LOWER(u2.family_name)), '([^\w]+| |-|_|\.)+', '-', 'gi') as lc_fn,
    u2.id
  FROM users u2
  ) u3 ON u3.id = u.id
JOIN (
  SELECT
    MAX(COALESCE(NULLIF(REPLACE(u4.login, CONCAT(u3.lc_gn, '.', lc_fn), ''), '')::integer, 0)) + 1 AS new_number,
     u4.id
  FROM users u4
  WHERE u4.login ~ CONCAT('^', lc_gn, '.', lc_fn, '[0-9]*')
  ) u4 ON u4.id = u.id;











login_to_insert_formatted AS (
  SELECT
    u.rn,
    u.unique_id,
    lc_gn,
    lc_fn,
    CONCAT(lc_gn, '.', lc_fn) AS base_login
  FROM users_inserted u
  JOIN (
    SELECT
    REGEXP_REPLACE(unaccent(LOWER(u2.given_name)), '([^\w]+| |-|_|\.)+', '-', 'gi') as lc_gn,
    REGEXP_REPLACE(unaccent(LOWER(u2.family_name)), '([^\w]+| |-|_|\.)+', '-', 'gi') as lc_fn,
    u2.unique_id
    FROM users_inserted u2
    ) u3 ON u3.unique_id = u.unique_id
), login_to_insert_number AS (
  SELECT
    l.*,
    (
      SELECT MAX(COALESCE(NULLIF(REPLACE(u4.login, l.base_login, ''), '')::integer, 0))
      FROM users u4
      WHERE u4.login ~ CONCAT('^', l.base_login, '[0-9]*')
    ) AS login_number_in_db,
    (
      SELECT new_order.rn2 as login_number_to_insert
      FROM (
        SELECT row_number() OVER (ORDER BY l2.rn ASC) as rn2, l2.rn, l2.unique_id
        FROM login_to_insert_formatted l2
        WHERE l2.base_login = l.base_login
      ) new_order
      WHERE new_order.unique_id = l.unique_id
    )
  FROM login_to_insert_formatted l
)
SELECT * FROM login_to_insert_number;


 */
