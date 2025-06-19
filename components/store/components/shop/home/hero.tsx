import React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { heroTransitionVariants } from "@/utils/animation/motion";
import { AnimatedGroup } from "@/components/core/animated-group";
import { SparklesIcon } from "lucide-react";
import { TextEffect } from "@/components/core/text-effect";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <Container
      size={"2xl"}
      height={"full"}
      padding={"md"}
      className="overflow-hidden"
      id="home"
    >
      <div
        aria-hidden
        className="absolute inset-0 isolate hidden contain-strict lg:block"
      >
        <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsl(265,100%,72%,.12)_0,hsl(265,95%,62%,.04)_50%,hsl(265,95%,55%,0)_80%)]" />

        <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsl(265,100%,72%,.10)_0,hsl(265,95%,55%,.03)_80%,transparent_100%)] [translate:5%_-50%]" />

        <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsl(265,100%,72%,.08)_0,hsl(265,95%,55%,.03)_80%,transparent_100%)]" />
      </div>

      <section>
        <div className="relative pt-24 md:pt-36">
          <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--color-background)_75%)]"></div>
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
              <AnimatedGroup variants={heroTransitionVariants}>
                <Link
                  href="/about"
                  className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950"
                >
                  <span className="text-foreground text-sm">
                    Introducing Elysian Emporium Ecommerce
                  </span>
                  <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                  <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                    <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                      <span className="flex size-6">
                        <SparklesIcon className="m-auto size-3" />
                      </span>
                      <span className="flex size-6">
                        <SparklesIcon className="m-auto size-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </AnimatedGroup>

              <Heading
                size={"lg"}
                font={"PolySansMedian"}
                spacing={"normal"}
                lineHeight={"none"}
                margin={"none"}
                className="mt-8 text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem]"
              >
                <TextEffect preset="fade-in-blur" speedSegment={0.3} as="p">
                  Inspiring Your World, One Discovery at a Time.
                </TextEffect>
              </Heading>
              <TextEffect
                per="line"
                preset="fade-in-blur"
                speedSegment={0.3}
                delay={0.5}
                as="p"
                className="mx-auto mt-8 max-w-3xl text-md text-balance"
              >
                Elysian Emporium offers a hand-picked selection of exceptional
                products designed to bring elegance and joy into your world.
              </TextEffect>

              <AnimatedGroup
                variants={{
                  container: {
                    visible: {
                      transition: {
                        staggerChildren: 0.05,
                        delayChildren: 0.75,
                      },
                    },
                  },
                  ...heroTransitionVariants,
                }}
                className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
              >
                <div key={1}>
                  <Button asChild size="lg">
                    <Link href="#link">
                      <span className="text-nowrap">Start Shopping</span>
                    </Link>
                  </Button>
                </div>
                <Button key={2} asChild size="lg" variant="ghost">
                  <Link href="#link">
                    <span className="text-nowrap">Contact Us</span>
                  </Link>
                </Button>
              </AnimatedGroup>
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
};

export default Hero;
