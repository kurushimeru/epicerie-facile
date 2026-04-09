import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import { createHash } from 'crypto'

interface ClickPayload {
  productId: string
  storeId: string
  productUrl: string
}

export async function POST(req: NextRequest) {
  const body: ClickPayload = await req.json().catch(() => null)

  if (!body?.productId || !body?.storeId || !body?.productUrl) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  // Résoudre user_id si connecté (optionnel — anonyme OK)
  let userId: string | null = null
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', user.id)
        .single()
      userId = data?.id ?? null
    }
  } catch {
    // pas de session = anonyme, on continue
  }

  // Hash IP — jamais stocker en clair
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? req.headers.get('x-real-ip') ?? ''
  const ipHash = ip ? createHash('sha256').update(ip).digest('hex') : null

  const service = createServiceClient()
  await service.from('outbound_clicks').insert({
    user_id: userId,
    product_id: body.productId,
    store_id: body.storeId,
    referrer: req.headers.get('referer'),
    user_agent: req.headers.get('user-agent'),
  })

  // Redirect 302 vers l'URL produit de l'enseigne
  return NextResponse.redirect(body.productUrl, { status: 302 })
}
