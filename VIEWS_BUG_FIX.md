# Views Bug Fix - Complete Solution

## The Problem

### What was happening:
1. **One launch page**: Views were incrementing rapidly (multiple times per second)
2. **Other launch pages**: Views weren't incrementing at all

### Root Cause:
The `useEffect` hook had both `launchSlug` and `launch` in its dependency array:
```typescript
useEffect(() => {
  // ...
}, [launchSlug, launch])  // ❌ INFINITE LOOP!
```

This created an **infinite loop**:
1. Page loads → `fetchLaunch()` runs → sets `launch` state
2. `launch` changes → triggers `useEffect` again
3. `fetchLaunch()` runs again → updates `launch` state
4. Back to step 2 → **INFINITE LOOP!** 🔄

The one launch that was incrementing rapidly was caught in this loop. The others likely had errors or null data that prevented the loop from starting.

## The Solution

### 1. Fixed the useEffect Hook
**Before:**
```typescript
useEffect(() => {
  async function incrementViews() {
    if (!launch) return;
    await supabase
      .from('launches')
      .update({ views_count: launch.views_count + 1 })
      .eq('slug', launchSlug)
  }

  if (launchSlug) {
    fetchLaunch()
    incrementViews()
  }
}, [launchSlug, launch])  // ❌ Infinite loop
```

**After:**
```typescript
useEffect(() => {
  if (launchSlug) {
    fetchLaunch()
    checkUser()
  }
}, [launchSlug])  // ✅ Only runs when slug changes
```

### 2. Created an Atomic View Increment Function
Created a PostgreSQL function to increment views atomically (prevents race conditions):

**File:** `increment-views-function.sql`
```sql
CREATE OR REPLACE FUNCTION increment_launch_views(launch_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE launches
  SET views_count = views_count + 1
  WHERE slug = launch_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION increment_launch_views(TEXT) TO authenticated, anon;
```

### 3. Updated fetchLaunch to Use RPC
**Before:**
```typescript
// Fetch data
const { data } = await supabase.from('launches').select(...).single()

// Increment views (using data from state)
await supabase.from('launches')
  .update({ views_count: data.views_count + 1 })
  .eq('slug', launchSlug)
```

**After:**
```typescript
// Increment views first (atomic operation)
await supabase.rpc('increment_launch_views', { launch_slug: launchSlug })

// Then fetch the updated data
const { data } = await supabase.from('launches').select(...).single()
```

## Benefits of This Approach

1. ✅ **No infinite loops** - `useEffect` only depends on `launchSlug`
2. ✅ **Atomic increments** - Uses SQL `views_count = views_count + 1` directly
3. ✅ **No race conditions** - Each page load increments exactly once
4. ✅ **Works for all users** - Logged in or not, views increment
5. ✅ **Multiple views allowed** - Users can refresh and views increment each time

## Setup Instructions

### Step 1: Run the SQL Function
1. Go to your Supabase project
2. Open the SQL Editor
3. Run the contents of `increment-views-function.sql`
4. Verify it executed successfully

### Step 2: Test
1. Clear your browser cache
2. Restart your dev server: `npm run dev`
3. Visit different launch pages
4. Verify that views increment by 1 on each page load
5. Refresh the page and verify views increment again

### Step 3: Verify in Database
Run this query in Supabase SQL Editor to check view counts:
```sql
SELECT id, name, slug, views_count 
FROM launches 
WHERE status = 'published'
ORDER BY views_count DESC;
```

## Files Modified

1. ✅ `app/launch/[id]/page.tsx` - Fixed infinite loop and implemented RPC call
2. ✅ `increment-views-function.sql` - Created atomic increment function

## Testing Checklist

- [ ] Run `increment-views-function.sql` in Supabase SQL Editor
- [ ] Visit a launch page - views should increment by 1
- [ ] Refresh the same page - views should increment again
- [ ] Visit a different launch page - views should increment
- [ ] Check that all launch pages increment correctly
- [ ] Verify no infinite loop (views shouldn't jump rapidly)
- [ ] Test with and without being logged in

## Troubleshooting

**If views still aren't incrementing:**
1. Check browser console for errors
2. Verify the SQL function was created: `SELECT * FROM pg_proc WHERE proname = 'increment_launch_views';`
3. Check RLS policies allow the function to update launches
4. Verify the `slug` field exists and matches the URL parameter

**If you see RPC errors:**
Make sure you ran the SQL function creation script and granted permissions to `authenticated` and `anon` roles.

