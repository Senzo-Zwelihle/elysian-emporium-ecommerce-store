import { InView } from '@/components/core/in-view'
import { InfiniteSlider } from '@/components/core/infinite-slider'
import { ProgressiveBlur } from '@/components/core/progressive-blur'
import { Container } from '@/components/ui/container'
import { Heading } from '@/components/ui/heading'
import { paymentBrandsItems } from '@/constants/store/brand'
import Image from 'next/image'
import React from 'react'

const PaymentBrands = () => {
  return (
   <Container size={"2xl"} height={"full"} padding={"md"} id='payments'>
      <Heading
        size={"md"}
        font={"PolySansMedian"}
        spacing={"normal"}
        lineHeight={"none"}
        margin={"sm"}
      >
        Payment
      </Heading>

      <InView
        variants={{
          hidden: { opacity: 0, y: 100, filter: "blur(4px)" },
          visible: { opacity: 1, y: 0, filter: "blur(0px)" },
        }}
        viewOptions={{ margin: "0px 0px -200px 0px" }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="group relative">
          <div className="flex flex-col items-center md:flex-row">
            <div className="md:max-w-44 md:border-r md:pr-6">
              <p className="text-base">Secure Payments, Trusted By</p>
            </div>
            <div className="relative py-6 md:w-[calc(100%-11rem)]">
              <InfiniteSlider speedOnHover={20} speed={40} gap={112}>
                {paymentBrandsItems.map((logo, index) => (
                  <div key={index} className="flex">
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      height={logo.height}
                      width={logo.width}
                      className={`mx-auto ${logo.className} w-fit `}
                    />
                  </div>
                ))}
              </InfiniteSlider>

              <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20"></div>
              <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20"></div>
              <ProgressiveBlur
                className="pointer-events-none absolute left-0 top-0 h-full w-20"
                direction="left"
                blurIntensity={1}
              />
              <ProgressiveBlur
                className="pointer-events-none absolute right-0 top-0 h-full w-20"
                direction="right"
                blurIntensity={1}
              />
            </div>
          </div>
        </div>
      </InView>
    </Container>
  )
}

export default PaymentBrands