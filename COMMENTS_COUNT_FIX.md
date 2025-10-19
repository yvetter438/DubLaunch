# Comment Count Sync Fix

## Problem
Comment counts on the discover and leaderboard pages don't accurately reflect the actual number of comments on each launch post.

## Root Cause
The `comments_count` field in the `launches` table is out of sync with the actual comments in the `comments` table. This happens when:
1. Database triggers for comment counts don't exist
2. Comments were added before triggers were created
3. Triggers aren't firing due to RLS policies

## Solution

### Quick Fix (Run This Now!)

1. Open your Supabase SQL Editor
2. Copy and paste the entire contents of `fix-comments-count.sql`
3. Click "Run"

This will:
- ✅ Create/update triggers to automatically update comment counts
- ✅ Recalculate ALL comment counts from actual comments
- ✅ Show verification table to confirm it worked

### What the Script Does

#### Creates Triggers
When a comment is added → `comments_count` increases by 1
When a comment is deleted → `comments_count` decreases by 1

#### Syncs All Counts
```sql
UPDATE launches
SET comments_count = (
  SELECT COUNT(*)
  FROM comments
  WHERE comments.launch_id = launches.id
);
```

This recalculates the count for every launch based on actual comments in the database.

## Verification

After running the script, you should see output showing all launches with "✓ FIXED" status.

Then:
1. Refresh your discover page
2. Refresh your leaderboard page
3. Comment counts should now be accurate
4. Try adding a new comment - count should update automatically
5. Try deleting a comment - count should decrease

## Manual Verification Query

```sql
-- Check if any counts are still out of sync
SELECT 
  l.name,
  l.comments_count as stored_count,
  COUNT(c.id) as actual_count,
  l.comments_count - COUNT(c.id) as difference
FROM launches l
LEFT JOIN comments c ON c.launch_id = l.id
WHERE l.status = 'published'
GROUP BY l.id, l.name, l.comments_count
HAVING l.comments_count != COUNT(c.id);
```

**Expected Result:** 0 rows (no mismatches)

## Future Prevention

With the triggers in place:
- ✅ New comments automatically increment the count
- ✅ Deleted comments automatically decrement the count
- ✅ No manual syncing needed

## If Counts Get Out of Sync Again

Just run this simple query:
```sql
UPDATE launches
SET comments_count = (
  SELECT COUNT(*)
  FROM comments
  WHERE comments.launch_id = launches.id
);
```

## Related Fixes

This is similar to the vote count fix. If you haven't run that yet, you should also run:
- `fix-votes-now.sql` - Syncs vote counts
- `increment-views-function.sql` - Fixes view counting

## Troubleshooting

### Issue: "Permission Denied"
**Solution:** Make sure you're running as database owner or superuser

### Issue: Triggers Don't Fire
**Solution:** 
1. Check RLS policies allow updates
2. Verify functions are marked as `SECURITY DEFINER`
3. Drop and recreate triggers

### Issue: Counts Still Wrong
**Solution:**
1. Run the sync script again
2. Check for orphaned comments (comments pointing to deleted launches)
3. Verify the comments table has correct launch_id values

## Complete System Sync

To sync all counts at once (votes, views, and comments):

```sql
-- Sync votes
UPDATE launches
SET votes_count = (
  SELECT COUNT(*)
  FROM votes
  WHERE votes.launch_id = launches.id
);

-- Sync comments
UPDATE launches
SET comments_count = (
  SELECT COUNT(*)
  FROM comments
  WHERE comments.launch_id = launches.id
);

-- Views are handled by the increment_launch_views() function
-- No sync needed for views
```

