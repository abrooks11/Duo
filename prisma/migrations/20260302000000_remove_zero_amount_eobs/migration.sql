-- Remove existing $0 amount EOB records that should not have been synced
DELETE FROM "Eob" WHERE "amount" = 0;
