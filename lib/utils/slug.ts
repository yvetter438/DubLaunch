/**
 * Generate a URL-friendly slug from a string
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    // Replace spaces and special characters with dashes
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    // Remove multiple consecutive dashes
    .replace(/-+/g, '-')
    // Remove leading/trailing dashes
    .replace(/^-+|-+$/g, '')
}

/**
 * Check if a slug is available (no duplicates)
 */
export async function checkSlugAvailability(slug: string, currentLaunchId?: string) {
  try {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    
    let query = supabase
      .from('launches')
      .select('id, slug')
      .eq('slug', slug)
    
    // If updating an existing launch, exclude it from the check
    if (currentLaunchId) {
      query = query.neq('id', currentLaunchId)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error checking slug availability:', error)
      return false
    }
    
    return data.length === 0
  } catch (error) {
    console.error('Error checking slug availability:', error)
    return false
  }
}

/**
 * Generate a unique slug by adding a number suffix if needed
 */
export async function generateUniqueSlug(title: string, currentLaunchId?: string): Promise<string> {
  const baseSlug = generateSlug(title)
  
  // Check if base slug is available
  const isAvailable = await checkSlugAvailability(baseSlug, currentLaunchId)
  
  if (isAvailable) {
    return baseSlug
  }
  
  // If not available, try with number suffixes
  let counter = 1
  let slug = `${baseSlug}-${counter}`
  
  while (!(await checkSlugAvailability(slug, currentLaunchId))) {
    counter++
    slug = `${baseSlug}-${counter}`
  }
  
  return slug
}
