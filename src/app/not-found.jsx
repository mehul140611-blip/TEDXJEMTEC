import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export const metadata = {
  title: "Out of frame",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="relative flex min-h-[80dvh] items-center pb-24 pt-[calc(var(--nav-h)+64px)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(235,0,40,0.2),transparent_60%)]"
      />
      <Container className="relative flex flex-col items-start gap-6">
        <h1 className="type-display">Out of frame.</h1>
        <p className="type-body text-muted">This page doesn&apos;t exist.</p>
        <Button href="/">Back to home</Button>
      </Container>
    </section>
  );
}
