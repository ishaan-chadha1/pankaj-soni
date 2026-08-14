import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative flex min-h-[86svh] items-center justify-center overflow-hidden px-6">
      <div className="absolute inset-0">
        <img
          src="/img/p-hero-02.svg"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "rgba(6,6,7,.78)" }} />
      </div>

      <div className="relative z-[2] text-center">
        <p className="ps-caps" style={{ color: "var(--gold)" }}>
          Error 404
        </p>
        <h1 className="ps-display mt-7 text-[3rem] leading-[0.98] sm:text-[5rem]">
          This piece has left
          <br />
          <span className="ps-display-i">the collection.</span>
        </h1>
        <p
          className="mx-auto mt-6 max-w-[42ch] text-[.94rem] font-light"
          style={{ color: "rgba(244,241,234,.7)" }}
        >
          The page you were looking for is no longer here. The archive, however,
          is still open.
        </p>
        <div className="mt-11 flex flex-wrap justify-center gap-4">
          <Link href="/" className="ps-btn ps-btn-solid">
            <span>Return to the Maison</span>
          </Link>
          <Link href="/c/fragrance" className="ps-btn">
            <span>Shop Fragrance</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
