"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import { setStage, stage, type StageTarget } from "@/lib/stage";

const SilkCanvas = dynamic(() => import("@/components/SilkCanvas"), { ssr: false });

gsap.registerPlugin(ScrollTrigger, SplitText);

const CHAPTERS = [
  {
    no: "01",
    name: "Banarasi Brocade",
    place: "Varanasi",
    img: "/images/banarasi_saree.jpg",
    alt: "Model in a crimson Banarasi saree with a flowing gold pallu in a marble palace corridor",
    body: "Silver zari gilded in 24k gold, woven on pit looms in the kadhua technique — every motif a separate island of gold, with not one loose thread on the reverse.",
    specs: [
      ["Weave", "180 days"],
      ["Zari", "98.5% silver-gilt"],
      ["Loom", "Pit loom, two weavers"],
    ],
  },
  {
    no: "02",
    name: "Kanjeevaram Temple Silk",
    place: "Kanchipuram",
    img: "/images/kanjeevaram_silk.jpg",
    alt: "Model in a teal Kanjeevaram silk saree with a magenta temple border, lit by diyas",
    body: "Three-ply mulberry silk with korvai borders: body and border woven separately, then interlocked by hand — a join made to outlive its wearer.",
    specs: [
      ["Weave", "45 days"],
      ["Silk", "3-ply mulberry"],
      ["Join", "Korvai interlock"],
    ],
  },
  {
    no: "03",
    name: "Rajputana Zardozi",
    place: "Jaipur",
    img: "/images/bridal_lehenga.jpg",
    alt: "Bride in a maroon and emerald zardozi lehenga beneath palace chandeliers",
    body: "Velvet and net worked in dabka, nakshi and kasab with a hand-held aari. A single bridal lehenga carries more than a hundred thousand stitches.",
    specs: [
      ["Hand-work", "1,200 hours"],
      ["Flare", "32 kalis"],
      ["Thread", "Kasab & dabka"],
    ],
  },
];

const COLLECTIONS = [
  { name: "The Bridal Edit", meta: "Lehengas · Jaipur", img: "/images/bridal_lehenga.jpg", alt: "Zardozi bridal lehenga", speed: -6 },
  { name: "Banaras Heirlooms", meta: "Brocade sarees · Varanasi", img: "/images/banarasi_saree.jpg", alt: "Crimson Banarasi saree", speed: 8 },
  { name: "Temple Silks", meta: "Kanjeevaram · Kanchipuram", img: "/images/kanjeevaram_silk.jpg", alt: "Teal Kanjeevaram saree", speed: -2 },
];

const BENEFITS = [
  ["Curated wholesale edits", "Seasonal capsules built for your clientele, from 12 pieces per style."],
  ["Exclusive city territory", "One boutique per neighbourhood carries each Maharani line."],
  ["A 3D digital lookbook", "This experience, white-labelled for your store — let brides explore every drape before they visit."],
  ["Ready in 21 days", "Stocked inventory dispatched insured; bespoke bridal in 90."],
];

const PARTNER_MAIL =
  "mailto:partners@maharani.co?subject=Boutique%20partnership%20enquiry&body=Store%20name%3A%0ACity%3A%0APhone%3A%0A";

export default function Site() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 767px)").matches;

    /* ------------------------------------------------ smooth scroll */
    const lenis = reduce ? null : new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
    const onTick = (t: number) => lenis?.raf(t * 1000);
    if (lenis) {
      lenis.on("scroll", (l: Lenis) => {
        stage.velocity = l.velocity;
        ScrollTrigger.update();
      });
      gsap.ticker.add(onTick);
      gsap.ticker.lagSmoothing(0);
      lenis.stop();
    }

    const onAnchor = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      e.preventDefault();
      const target = a.getAttribute("href")!;
      if (lenis) lenis.scrollTo(target, { duration: 2.2 });
      else document.querySelector(target)?.scrollIntoView();
    };
    document.addEventListener("click", onAnchor);

    const ctx = gsap.context(() => {
      /* ------------------------------------------------ cursor */
      const dot = document.querySelector<HTMLElement>(".cursor-dot")!;
      const ring = document.querySelector<HTMLElement>(".cursor-ring")!;
      const dx = gsap.quickTo(dot, "x", { duration: 0.12 });
      const dy = gsap.quickTo(dot, "y", { duration: 0.12 });
      const rx = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
      const ry = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });
      const move = (e: PointerEvent) => {
        dx(e.clientX);
        dy(e.clientY);
        rx(e.clientX);
        ry(e.clientY);
        ring.classList.toggle("is-hover", !!(e.target as HTMLElement).closest("a, button"));
      };
      window.addEventListener("pointermove", move);

      /* ------------------------------------------------ preloader → hero */
      const heroTitle = SplitText.create(".hero-title", { type: "chars" });
      gsap.set(heroTitle.chars, { yPercent: 110 });
      gsap.set(".hero-fade", { autoAlpha: 0, y: 24 });

      const counter = { v: 0 };
      const intro = gsap.timeline({ delay: 0.2 });
      intro
        .to(counter, {
          v: 100,
          duration: reduce ? 0.3 : 1.9,
          ease: "power2.inOut",
          onUpdate: () => {
            const el = document.querySelector(".loader-count");
            if (el) el.textContent = String(Math.round(counter.v)).padStart(3, "0");
          },
        })
        .to(".loader-line", { scaleX: 1, duration: reduce ? 0.3 : 1.9, ease: "power2.inOut" }, 0)
        .to(".loader-inner", { autoAlpha: 0, y: -20, duration: 0.5 })
        .to(".loader", { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, "-=0.1")
        .add(() => {
          stage.ready = true;
          setStage(states.hero);
          lenis?.start();
        }, "-=0.7")
        .to(heroTitle.chars, { yPercent: 0, duration: 1.4, ease: "expo.out", stagger: 0.045 }, "-=0.5")
        .to(".hero-fade", { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1, ease: "power3.out" }, "-=1");

      /* ------------------------------------------------ cloth choreography */
      const states: Record<string, Partial<StageTarget>> = {
        hero: mobile
          ? { x: 0.05, y: 1.0, tilt: 0.1, turn: -0.3, wind: 1, fabric: 0 }
          : { x: 0.5, y: 1.04, tilt: 0.12, turn: -0.35, wind: 1, fabric: 0 },
        story: mobile
          ? { x: 0.85, y: 1.1, tilt: -0.2, turn: 0.4, wind: 1.4, fabric: 0 }
          : { x: -0.6, y: 1.02, tilt: -0.14, turn: 0.45, wind: 1.35, fabric: 0 },
        drape: mobile
          ? { y: 3.4, wind: 1.6 }
          : { x: 0.64, y: 1.02, tilt: 0.06, turn: -0.25, wind: 1 },
        denim: { x: 0, y: 1.08, tilt: 0, turn: 0.1, wind: 1.7, fabric: 3 },
        craft: { y: 3.6, wind: 2.4 },
        collections: { y: 3.6, wind: 2 },
        partners: mobile
          ? { x: 0.7, y: 1.05, tilt: -0.1, turn: -0.3, wind: 1.1, fabric: 4 }
          : { x: 0.6, y: 1.02, tilt: -0.08, turn: -0.3, wind: 1.1, fabric: 4 },
        footer: { y: 3.6, wind: 2 },
      };

      /* ------------------------------------------------ manifesto words */
      const manifesto = SplitText.create(".manifesto", { type: "words" });
      gsap.fromTo(
        manifesto.words,
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: ".manifesto", start: "top 75%", end: "bottom 45%", scrub: true },
        },
      );

      /* ------------------------------------------------ line reveals */
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        const split = SplitText.create(el, { type: "lines", mask: "lines" });
        gsap.from(split.lines, {
          yPercent: 105,
          duration: 1.3,
          ease: "expo.out",
          stagger: 0.09,
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-fade]").forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          y: 30,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      /* ------------------------------------------------ the drape (pinned chapters) */
      const proxy = { f: 0 };
      const pushFabric = () => {
        if (stage.ready) stage.fabric = proxy.f;
      };
      const drape = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: "#drape",
          start: "top top",
          end: "+=260%",
          pin: true,
          scrub: 1,
        },
      });
      gsap.set(".drape-img:not(:first-child)", { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(".drape-copy:not(:first-child)", { autoAlpha: 0, y: 40 });
      drape.to({}, { duration: 0.5 });
      for (let i = 1; i < CHAPTERS.length; i++) {
        const at = `c${i}`;
        drape
          .addLabel(at)
          .to(`.drape-img:nth-child(${i + 1})`, { clipPath: "inset(0% 0% 0% 0%)", duration: 1 }, at)
          .fromTo(`.drape-img:nth-child(${i + 1}) img`, { scale: 1.3 }, { scale: 1, duration: 1.2 }, at)
          .to(`.drape-img:nth-child(${i}) img`, { scale: 1.12, duration: 1 }, at)
          .to(`.drape-copy:nth-child(${i})`, { autoAlpha: 0, y: -40, duration: 0.5 }, at)
          .to(`.drape-copy:nth-child(${i + 1})`, { autoAlpha: 1, y: 0, duration: 0.6 }, `${at}+=0.45`)
          .to(proxy, { f: i, duration: 1, ease: "none", onUpdate: pushFabric }, at)
          .to(".drape-progress", { scaleY: (i + 1) / CHAPTERS.length, duration: 1 }, at)
          .to({}, { duration: 0.6 });
      }

      /* ------------------------------------------------ denim marquee */
      gsap.fromTo(
        ".denim-marquee",
        { xPercent: 0 },
        {
          xPercent: -50,
          ease: "none",
          scrollTrigger: { trigger: "#denim", start: "top bottom", end: "bottom top", scrub: true },
        },
      );

      /* ------------------------------------------------ craft: loom opens to full bleed */
      const craft = gsap.timeline({
        scrollTrigger: { trigger: "#craft-pin", start: "top top", end: "+=150%", pin: true, scrub: 1 },
      });
      craft
        .fromTo(
          ".craft-frame",
          { clipPath: mobile ? "inset(22% 10% 22% 10% round 14px)" : "inset(16% 32% 16% 32% round 14px)" },
          { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "power2.inOut", duration: 1 },
        )
        .fromTo(".craft-frame img", { scale: 1.35 }, { scale: 1, ease: "power2.inOut", duration: 1 }, 0)
        .fromTo(".craft-side", { opacity: 1 }, { opacity: 0, duration: 0.3 }, 0)
        .fromTo(".craft-over", { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.7);

      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const end = Number(el.dataset.count);
        const o = { v: 0 };
        gsap.to(o, {
          v: end,
          duration: 2.2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
          onUpdate: () => {
            el.textContent = Math.round(o.v).toLocaleString("en-IN");
          },
        });
      });

      /* ------------------------------------------------ parallax */
      gsap.utils.toArray<HTMLElement>("[data-speed]").forEach((el) => {
        gsap.to(el, {
          yPercent: Number(el.dataset.speed) * -4,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
      gsap.utils.toArray<HTMLElement>(".card-img").forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".rule-draw").forEach((el) => {
        gsap.from(el, {
          scaleX: 0,
          transformOrigin: "left",
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        });
      });

      /* ------------------------------------------------ footer wordmark */
      const word = SplitText.create(".footer-word", { type: "chars" });
      gsap.from(word.chars, {
        yPercent: 100,
        stagger: 0.04,
        ease: "expo.out",
        duration: 1.4,
        scrollTrigger: { trigger: ".footer-word", start: "top 95%" },
      });

      // created last so every pin spacer above is already measured
      gsap.utils.toArray<HTMLElement>("[data-stage]").forEach((sec) => {
        const key = sec.dataset.stage!;
        ScrollTrigger.create({
          trigger: sec,
          start: "top 55%",
          end: "bottom 45%",
          onToggle: (self) => {
            if (!self.isActive) return;
            if (sec.dataset.theme) document.documentElement.dataset.theme = sec.dataset.theme;
            if (stage.ready) setStage(states[key]);
          },
        });
      });

      return () => window.removeEventListener("pointermove", move);
    }, root);

    return () => {
      ctx.revert();
      document.removeEventListener("click", onAnchor);
      if (lenis) {
        gsap.ticker.remove(onTick);
        lenis.destroy();
      }
    };
  }, []);

  return (
    <div ref={root}>
      <SilkCanvas />
      <div className="grain" aria-hidden="true" />
      <div className="cursor-dot" aria-hidden="true" />
      <div className="cursor-ring" aria-hidden="true" />

      {/* ---------------------------------------------------------- loader */}
      <div className="loader fixed inset-0 z-[80] flex items-center justify-center bg-ink text-[#f4eee4]">
        <div className="loader-inner w-[min(320px,70vw)] text-center">
          <p className="display text-3xl italic">Maharani &amp; Co.</p>
          <div className="mt-6 h-px w-full bg-white/10">
            <div className="loader-line h-px origin-left scale-x-0 bg-gold" />
          </div>
          <div className="mt-3 flex justify-between text-[10px] tracking-[0.3em] text-white/45 uppercase">
            <span>Weaving</span>
            <span className="loader-count tabular-nums">000</span>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------- nav */}
      <header className="fixed inset-x-0 top-0 z-50 text-white mix-blend-difference">
        <nav className="flex items-center justify-between px-5 py-5 md:px-10 md:py-7">
          <a href="#hero" className="display text-xl italic md:text-2xl">
            Maharani &amp; Co.
          </a>
          <ul className="hidden gap-10 text-[11px] tracking-[0.28em] uppercase md:flex">
            <li><a href="#drape" className="opacity-80 transition-opacity hover:opacity-100">Weaves</a></li>
            <li><a href="#denim" className="opacity-80 transition-opacity hover:opacity-100">Denim</a></li>
            <li><a href="#craft" className="opacity-80 transition-opacity hover:opacity-100">Atelier</a></li>
            <li><a href="#collections" className="opacity-80 transition-opacity hover:opacity-100">Collections</a></li>
          </ul>
          <a href="#partners" className="border-b border-white/60 pb-1 text-[11px] tracking-[0.28em] uppercase">
            For Boutiques
          </a>
        </nav>
      </header>

      <main>
        {/* ---------------------------------------------------------- hero */}
        <section id="hero" data-stage="hero" data-theme="ink" className="relative h-[100svh] overflow-hidden">
          <div className="layer-back absolute inset-0 flex items-center justify-center md:justify-start md:pl-[5vw]">
            <h1 className="hero-title display select-none text-[23vw] leading-none tracking-[-0.04em] md:text-[12.5vw]">
              Maharani
            </h1>
          </div>
          <div className="layer-front absolute inset-x-0 bottom-0 grid gap-8 px-5 pb-8 md:grid-cols-12 md:px-10 md:pb-10">
            <div className="md:col-span-4">
              <p className="hero-fade eyebrow">Handwoven couture · Est. 1962</p>
              <p className="hero-fade mt-4 max-w-sm text-[15px] leading-relaxed text-[var(--fg-mute)]">
                Banarasi brocades, Kanjeevaram temple silks and Rajputana zardozi — woven by hand for India&apos;s finest
                boutiques.
              </p>
            </div>
            <div className="hero-fade flex flex-wrap items-end gap-3 md:col-span-8 md:justify-end">
              <a href="#partners" className="btn btn-gold">Become a stockist</a>
              <a href="#drape" className="btn btn-ghost">Explore the weaves</a>
            </div>
          </div>
          <div className="hero-fade layer-front absolute top-1/2 right-5 hidden -translate-y-1/2 md:right-10 md:block">
            <p className="eyebrow [writing-mode:vertical-rl]">Scroll — the silk follows</p>
          </div>
        </section>

        {/* ---------------------------------------------------------- manifesto */}
        <section id="story" data-stage="story" data-theme="ink" className="relative px-5 py-[22vh] md:px-10">
          <div className="layer-front md:ml-[38%] md:max-w-[56vw]">
            <p className="eyebrow mb-10">The house</p>
            <p className="manifesto display text-[9.5vw] leading-[1.02] md:text-[4.4vw]">
              Six decades, three looms, one belief — that a sari is not sewn but <em className="text-gold">woven</em>,
              thread by gold thread, by hands that learned from hands before them.
            </p>
          </div>
        </section>

        {/* ---------------------------------------------------------- the drape */}
        <section id="drape" data-stage="drape" data-theme="ink" className="relative h-[100svh] overflow-hidden">
          <div className="layer-front absolute inset-0 px-5 pt-24 pb-8 md:px-[6vw] md:pt-0 md:pb-0">
            <div className="relative mx-auto aspect-[4/5] w-[78vw] overflow-hidden rounded-[10px] md:absolute md:top-1/2 md:left-[6vw] md:mx-0 md:w-[30vw] md:max-w-[520px] md:-translate-y-1/2">
              {CHAPTERS.map((c, i) => (
                <div key={c.no} className="drape-img absolute inset-0 overflow-hidden">
                  <Image
                    src={c.img}
                    alt={c.alt}
                    fill
                    priority={i === 0}
                    sizes="(max-width: 768px) 78vw, 30vw"
                    className="object-cover"
                    style={{ objectPosition: i === 2 ? "60% 40%" : "55% 50%" }}
                  />
                </div>
              ))}
            </div>

            <div className="relative mt-6 h-[38svh] md:absolute md:top-1/2 md:left-[42vw] md:mt-0 md:h-auto md:w-[22vw] md:-translate-y-1/2">
              {CHAPTERS.map((c) => (
                <article key={c.no} className="drape-copy absolute inset-x-0 top-0 md:relative md:[&:not(:first-child)]:absolute md:[&:not(:first-child)]:top-0">
                  <p className="eyebrow">
                    {c.no} — {c.place}
                  </p>
                  <h2 className="display mt-4 text-5xl md:text-[3.6vw]">{c.name}</h2>
                  <p className="mt-5 text-[14px] leading-relaxed text-[var(--fg-mute)] md:text-[15px]">{c.body}</p>
                  <dl className="mt-7 grid grid-cols-3 gap-3 border-t border-[var(--line)] pt-5">
                    {c.specs.map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-[10px] tracking-[0.25em] text-[var(--fg-mute)] uppercase">{k}</dt>
                        <dd className="display mt-1 text-lg leading-tight md:text-xl">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </article>
              ))}
            </div>

            <div className="absolute top-1/2 right-5 hidden h-40 w-px -translate-y-1/2 bg-[var(--line)] md:right-10 md:block">
              <div className="drape-progress h-full w-px origin-top bg-gold" style={{ transform: "scaleY(0.3333)" }} />
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- denim */}
        <section id="denim" data-stage="denim" data-theme="indigo" className="relative h-[200svh]">
          <div className="sticky top-0 h-[100svh] overflow-hidden">
            <div className="layer-back absolute inset-0 flex items-center">
              <div className="denim-marquee display flex whitespace-nowrap text-[26vw] leading-none italic md:text-[17vw]">
                {Array.from({ length: 4 }).map((_, i) => (
                  <span key={i} className={i % 2 ? "outline-text pr-[4vw] opacity-60" : "pr-[4vw]"}>
                    Denim, re-tailored —
                  </span>
                ))}
              </div>
            </div>
            <div className="layer-front absolute inset-x-0 bottom-0 grid gap-8 px-5 pb-8 md:grid-cols-12 md:px-10 md:pb-10">
              <div className="md:col-span-4" data-fade>
                <p className="eyebrow">New · The denim atelier</p>
                <p className="display mt-4 text-4xl md:text-5xl">Selvedge, finished in zari.</p>
                <p className="mt-4 hidden max-w-sm text-[14px] leading-relaxed text-[var(--fg-mute)] md:block">
                  Our newest loom weaves 14oz selvedge denim, then hands it to the karigars who embroider our bridal wear —
                  jackets, jeans and Indo-western sets with chain-stitch zari and copper hardware.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-6 self-end md:col-span-4 md:col-start-9">
                {[
                  ["14", "oz selvedge"],
                  ["38", "pieces / drop"],
                  ["6", "week lead time"],
                ].map(([n, l]) => (
                  <div key={l} className="border-t border-[var(--line)] pt-4">
                    <p className="display text-5xl" data-count={n}>
                      0
                    </p>
                    <p className="mt-2 text-[10px] tracking-[0.25em] text-[var(--fg-mute)] uppercase">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- craft */}
        <section id="craft" data-stage="craft" data-theme="ivory" className="relative">
          <div id="craft-pin" className="relative h-[100svh] overflow-hidden">
            <div className="craft-side absolute inset-x-0 top-24 z-10 px-5 md:top-auto md:bottom-10 md:px-10">
              <div className="flex items-end justify-between">
                <p className="eyebrow">The atelier</p>
                <p className="eyebrow hidden md:block">Varanasi · Kanchipuram · Jaipur</p>
              </div>
            </div>
            <div className="craft-frame absolute inset-0 overflow-hidden">
              <Image
                src="/images/craftsmanship_loom.jpg"
                alt="A master weaver's hands guiding gold zari through crimson silk on a wooden handloom"
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            </div>
            <div className="craft-over absolute inset-x-0 bottom-0 z-10 px-5 pb-10 text-[#f6efe3] md:px-10 md:pb-14">
              <p className="display max-w-4xl text-[11vw] leading-[0.95] md:text-[6.2vw]">
                Six months. One loom. <em className="text-gold-hi">Two pairs of hands.</em>
              </p>
            </div>
          </div>

          <div className="grid gap-12 px-5 py-[16vh] md:grid-cols-12 md:px-10">
            <div className="md:col-span-5">
              <h2 data-reveal className="display text-5xl md:text-[4.2vw]">
                Every piece carries the name of the weaver who made it.
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:col-span-6 md:col-start-7">
              {[
                ["140", "master weavers on our looms"],
                ["62", "years of family craft"],
                ["38", "partner boutiques across India"],
                ["100", "percent handloom, certified"],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="rule-draw h-px bg-[var(--fg)]/20" />
                  <p className="display mt-5 text-6xl md:text-7xl" data-count={n}>
                    0
                  </p>
                  <p className="mt-3 max-w-[16ch] text-[13px] leading-snug text-[var(--fg-mute)]">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- collections */}
        <section id="collections" data-stage="collections" data-theme="ivory" className="relative px-5 pb-[8vh] md:px-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 data-reveal className="display text-6xl md:text-[7vw]">
              The <em>collections</em>
            </h2>
            <p data-fade className="max-w-xs text-[14px] leading-relaxed text-[var(--fg-mute)]">
              Each edit ships with styling notes, fabric passports and in-store display guidance for your team.
            </p>
          </div>
          <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-6">
            {COLLECTIONS.map((c, i) => (
              <a
                key={c.name}
                href="#partners"
                data-speed={c.speed}
                className={`group block ${i === 1 ? "md:mt-28" : i === 2 ? "md:mt-12" : ""}`}
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-[8px]">
                  <div className="card-img absolute -inset-y-[10%] inset-x-0">
                    <Image
                      src={c.img}
                      alt={c.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-luxe)] group-hover:scale-[1.06]"
                    />
                  </div>
                </div>
                <div className="mt-5 flex items-baseline justify-between border-b border-[var(--line)] pb-4">
                  <h3 className="display text-3xl">{c.name}</h3>
                  <span className="text-[10px] tracking-[0.25em] text-[var(--fg-mute)] uppercase transition-colors group-hover:text-[var(--fg)]">
                    Lookbook →
                  </span>
                </div>
                <p className="mt-3 text-[12px] tracking-[0.2em] text-[var(--fg-mute)] uppercase">{c.meta}</p>
              </a>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------- partners */}
        <section id="partners" data-stage="partners" data-theme="ink" className="relative px-5 py-[20vh] md:px-10">
          <div className="layer-front md:max-w-[52vw]">
            <p className="eyebrow" data-fade>
              Retail partnerships
            </p>
            <h2 data-reveal className="display mt-6 text-[13vw] md:text-[6vw]">
              Bring the atelier to <em className="text-gold">your boutique.</em>
            </h2>
            <ol className="mt-16">
              {BENEFITS.map(([t, d], i) => (
                <li key={t} className="relative py-7">
                  <div className="rule-draw absolute inset-x-0 top-0 h-px bg-[var(--line)]" />
                  <div className="grid grid-cols-[3rem_1fr] gap-4 md:grid-cols-[4rem_1fr_1.2fr] md:gap-8" data-fade>
                    <span className="display text-xl text-gold italic">0{i + 1}</span>
                    <h3 className="display text-2xl md:text-3xl">{t}</h3>
                    <p className="col-start-2 text-[14px] leading-relaxed text-[var(--fg-mute)] md:col-start-3">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-12 flex flex-wrap gap-3" data-fade>
              <a href={PARTNER_MAIL} className="btn btn-gold">Request wholesale catalogue</a>
              <a href={PARTNER_MAIL} className="btn btn-ghost">Book a trunk show</a>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- footer */}
        <footer data-stage="footer" data-theme="ink" className="relative overflow-hidden px-5 pt-[14vh] pb-8 md:px-10">
          <div className="gold-rule mb-10" />
          <div className="grid gap-8 text-[12px] tracking-[0.2em] text-[var(--fg-mute)] uppercase md:grid-cols-4">
            <p>Varanasi Atelier<br />Kanchipuram Guild<br />Jaipur Salon</p>
            <p>partners@maharani.co</p>
            <p>
              <a href="#" className="hover:text-[var(--fg)]">Instagram</a>
              <br />
              <a href="#" className="hover:text-[var(--fg)]">Pinterest</a>
            </p>
            <p className="md:text-right">© 2026 Maharani &amp; Co.</p>
          </div>
          <p className="footer-word display mt-16 overflow-hidden text-center text-[13.5vw] leading-[0.9] tracking-[-0.04em] whitespace-nowrap">
            Maharani &amp; Co.
          </p>
        </footer>
      </main>
    </div>
  );
}
