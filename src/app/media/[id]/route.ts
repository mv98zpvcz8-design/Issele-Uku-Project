import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { SUPABASE_CONFIGURED } from "@/lib/supabase/config";

const SIGNED_URL_TTL_SECONDS = 60;

/**
 * The only way any archive media file is ever read — see the Storage
 * bucket migration's own comment. First asks the ordinary,
 * RLS-respecting client for the row: archive_media's existing policies
 * ("public can read for published items" / "staff can read all") mean
 * this query returns nothing at all for a file the caller shouldn't
 * see, exactly as if it queried any other RLS-protected table. Only
 * once that succeeds does it ask the service-role client (which
 * bypasses Storage's own, deliberately policy-less bucket) for a
 * short-lived signed URL and redirect there.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!SUPABASE_CONFIGURED) {
    return new NextResponse("Not found", { status: 404 });
  }

  const { id } = await params;
  const supabase = await createClient();
  const { data: media } = await supabase.from("archive_media").select("storage_path").eq("id", id).maybeSingle();
  if (!media) {
    return new NextResponse("Not found", { status: 404 });
  }

  const serviceRole = createServiceRoleClient();
  const { data: signed, error } = await serviceRole.storage
    .from("archive-media")
    .createSignedUrl(media.storage_path, SIGNED_URL_TTL_SECONDS);

  if (error || !signed) {
    return new NextResponse("Not found", { status: 404 });
  }

  return NextResponse.redirect(signed.signedUrl);
}
