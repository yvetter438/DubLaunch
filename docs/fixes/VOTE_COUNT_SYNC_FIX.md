# Vote Count Sync Issue - Complete Fix

## Problem
Vote counts aren't updating on the site even though votes are being added to the database. The `votes_count` field in the `launches` table is out of sync with the actual votes in the `votes` table.

## Root Cause
The database triggers that automatically update `votes_count` might not be working, or the counts were out of sync before the triggers were created.

## Solution - Run These SQL Scripts in Order

### Step 1: Verify Triggers Exist
Run this in Supabase SQL Editor to check if triggers are set up:

```sql
-- Check if vote count triggers exist
SELECT 
  tgname as trigger_name,
  tgrelid::regclass as table_name,
  proname as function_name
FROM pg_trigger 
JOIN pg_proc ON pg_trigger.tgfoid = pg_proc.oid
WHERE tgname LIKE '%vote%';
```

**Expected Output:** You should see:
- `trigger_update_vote_count_add` on `votes` table
- `trigger_update_vote_count_remove` on `votes` table

### Step 2: If Triggers Don't Exist, Create Them

```sql
-- Function to update launch vote count when vote is added
CREATE OR REPLACE FUNCTION update_launch_vote_count_add()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE launches 
  SET votes_count = votes_count + 1
  WHERE id = NEW.launch_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update launch vote count when vote is removed
CREATE OR REPLACE FUNCTION update_launch_vote_count_remove()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE launches 
  SET votes_count = GREATEST(votes_count - 1, 0)
  WHERE id = OLD.launch_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_update_vote_count_add ON votes;
CREATE TRIGGER trigger_update_vote_count_add
  AFTER INSERT ON votes
  FOR EACH ROW
  EXECUTE FUNCTION update_launch_vote_count_add();

DROP TRIGGER IF EXISTS trigger_update_vote_count_remove ON votes;
CREATE TRIGGER trigger_update_vote_count_remove
  AFTER DELETE ON votes
  FOR EACH ROW
  EXECUTE FUNCTION update_launch_vote_count_remove();
```

### Step 3: Sync All Vote Counts (IMPORTANT!)

This will recalculate all vote counts based on actual votes in the database:

```sql
-- Fix all vote counts by recalculating from votes table
UPDATE launches
SET votes_count = (
  SELECT COUNT(*)
  FROM votes
  WHERE votes.launch_id = launches.id
);

-- Verify the sync worked
SELECT 
  l.id,
  l.name,
  l.slug,
  l.votes_count as stored_count,
  COUNT(v.id) as actual_votes,
  CASE 
    WHEN l.votes_count = COUNT(v.id) THEN '✓ Synced'
    ELSE '✗ Out of Sync'
  END as status
FROM launches l
LEFT JOIN votes v ON v.launch_id = l.id
WHERE l.status = 'published'
GROUP BY l.id, l.name, l.slug, l.votes_count
ORDER BY l.created_at DESC;
```

### Step 4: Check RLS Policies

Make sure the triggers can update the `votes_count` field:

```sql
-- Check RLS policies on launches table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'launches';
```

If you see any issues, you may need to add a policy for the trigger function:

```sql
-- Allow triggers to update vote counts (if needed)
CREATE POLICY "Triggers can update vote counts" ON launches
  FOR UPDATE 
  USING (true)
  WITH CHECK (true);
```

## Testing After Fix

### Test 1: Check Vote Counts Match
```sql
-- This should show all launches with matching counts
SELECT 
  l.name,
  l.votes_count as displayed,
  COUNT(v.id) as actual
FROM launches l
LEFT JOIN votes v ON v.launch_id = l.id
GROUP BY l.id, l.name, l.votes_count
HAVING l.votes_count != COUNT(v.id);
```

**Expected:** Should return 0 rows (no mismatches)

### Test 2: Test Adding a Vote
1. Go to a launch page
2. Click the vote button
3. Refresh the page
4. Vote count should remain the same (not decrease)

### Test 3: Check Triggers Fire
```sql
-- Insert a test vote (replace with actual IDs)
INSERT INTO votes (user_id, launch_id)
VALUES ('your-user-id', 'your-launch-id');

-- Check if votes_count increased
SELECT name, votes_count FROM launches WHERE id = 'your-launch-id';

-- Clean up test vote
DELETE FROM votes WHERE user_id = 'your-user-id' AND launch_id = 'your-launch-id';

-- Check if votes_count decreased
SELECT name, votes_count FROM launches WHERE id = 'your-launch-id';
```

## Common Issues and Solutions

### Issue 1: "Permission Denied" Error
**Solution:** Make sure you're running the SQL as a superuser or the database owner.

### Issue 2: Triggers Exist But Don't Fire
**Solution:** 
1. Drop and recreate the triggers
2. Make sure RLS policies allow updates
3. Check that the function is marked as `SECURITY DEFINER`

### Issue 3: Counts Still Don't Match
**Solution:**
1. Run the sync script again (Step 3)
2. Check for orphaned votes (votes pointing to deleted launches)
3. Look for duplicate votes

## Monitoring Vote Counts

Create this view for easy monitoring:

```sql
-- Create a view to monitor vote count accuracy
CREATE OR REPLACE VIEW vote_count_status AS
SELECT 
  l.id,
  l.name,
  l.slug,
  l.votes_count as stored_count,
  COUNT(v.id) as actual_count,
  l.votes_count - COUNT(v.id) as difference,
  CASE 
    WHEN l.votes_count = COUNT(v.id) THEN 'OK'
    WHEN l.votes_count > COUNT(v.id) THEN 'TOO HIGH'
    WHEN l.votes_count < COUNT(v.id) THEN 'TOO LOW'
  END as status
FROM launches l
LEFT JOIN votes v ON v.launch_id = l.id
WHERE l.status = 'published'
GROUP BY l.id, l.name, l.slug, l.votes_count
ORDER BY ABS(l.votes_count - COUNT(v.id)) DESC;

-- Use it like this:
SELECT * FROM vote_count_status WHERE status != 'OK';
```

## Prevention

To prevent this from happening again:

1. ✅ Make sure triggers are always active
2. ✅ Don't manually update votes_count
3. ✅ Always use the votes table for adding/removing votes
4. ✅ Periodically run the sync script (weekly/monthly)
5. ✅ Monitor the vote_count_status view

## Quick Fix Script (Run This Now!)

```sql
-- ALL-IN-ONE FIX SCRIPT
-- Run this in Supabase SQL Editor

-- 1. Create/Update the functions
CREATE OR REPLACE FUNCTION update_launch_vote_count_add()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE launches 
  SET votes_count = votes_count + 1
  WHERE id = NEW.launch_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_launch_vote_count_remove()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE launches 
  SET votes_count = GREATEST(votes_count - 1, 0)
  WHERE id = OLD.launch_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create/Replace the triggers
DROP TRIGGER IF EXISTS trigger_update_vote_count_add ON votes;
CREATE TRIGGER trigger_update_vote_count_add
  AFTER INSERT ON votes
  FOR EACH ROW
  EXECUTE FUNCTION update_launch_vote_count_add();

DROP TRIGGER IF EXISTS trigger_update_vote_count_remove ON votes;
CREATE TRIGGER trigger_update_vote_count_remove
  AFTER DELETE ON votes
  FOR EACH ROW
  EXECUTE FUNCTION update_launch_vote_count_remove();

-- 3. Sync all existing vote counts
UPDATE launches
SET votes_count = (
  SELECT COUNT(*)
  FROM votes
  WHERE votes.launch_id = launches.id
);

-- 4. Show the results
SELECT 
  l.name,
  l.votes_count as displayed_count,
  COUNT(v.id) as actual_votes,
  CASE 
    WHEN l.votes_count = COUNT(v.id) THEN '✓ Synced'
    ELSE '✗ Still Out of Sync'
  END as status
FROM launches l
LEFT JOIN votes v ON v.launch_id = l.id
WHERE l.status = 'published'
GROUP BY l.id, l.name, l.votes_count
ORDER BY l.created_at DESC;
```

## After Running the Fix

1. Refresh your website pages
2. Vote counts should now be accurate
3. New votes will automatically update the count
4. Removing votes will automatically decrement the count

## Verification Commands

```sql
-- Count total votes in votes table
SELECT COUNT(*) as total_votes FROM votes;

-- Count sum of votes_count in launches table
SELECT SUM(votes_count) as total_displayed FROM launches WHERE status = 'published';

-- These should match!
```

If they don't match, run the sync script again.



