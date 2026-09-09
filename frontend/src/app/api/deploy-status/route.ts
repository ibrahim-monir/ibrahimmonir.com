// Lets the deploy workflow confirm the commit it just shipped is actually
// live, the same way upokoron's update.php reports build.json — the
// commonest deploy mistake is the bundle landing in the wrong folder, and
// the site then looks unchanged for a reason nobody can see from the outside.
export async function GET() {
  return Response.json({
    commit: process.env.NEXT_PUBLIC_BUILD_COMMIT ?? null,
    builtAt: process.env.NEXT_PUBLIC_BUILD_TIME ?? null,
  });
}
