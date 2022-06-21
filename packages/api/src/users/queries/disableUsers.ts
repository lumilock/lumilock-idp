export default `
  UPDATE users
  SET is_active = false,
  is_archived = true
  FROM (
    SELECT u.* FROM users u
    LEFT JOIN users_clients uc ON uc.user_id = u.id
    WHERE uc.id IN (%1$L)
    AND uc.client_id = %2$L'::uuid
  ) AS u
  WHERE u.id = users.id
  AND (
    users.is_active::boolean IS DISTINCT FROM 'false'::boolean
    OR users.is_archived::boolean IS DISTINCT FROM 'true'::boolean
  )
  RETURNING users.id;
`;
