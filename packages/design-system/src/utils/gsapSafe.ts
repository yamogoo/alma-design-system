export async function loadGsap() {
  const mod = await import("gsap");
  return mod?.gsap ?? mod?.default ?? null;
}
