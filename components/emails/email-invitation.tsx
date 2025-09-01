import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import { env } from "@/env/server";

interface InvitationEmailProps {
  inviterName: string;
  organizationName: string;
  acceptUrl: string;
}

const InvitationEmail = (props: InvitationEmailProps) => {
  const { inviterName, organizationName, acceptUrl } = props;
  const logoUrl = `${env.ELYSIAN_EMPORIUM_LOGO}`;

  return (
    <Html lang="en" dir="ltr">
      <Tailwind>
        <Head />
        <Body className="bg-white font-sans">
          <Preview>You've been invited to join {organizationName}</Preview>
          <Container className="max-w-[600px] mx-auto">
            {/* Header */}
            <Section className="px-[40px] pt-[48px] pb-[32px]">
              <Img
                src={logoUrl}
                width="48"
                height="48"
                alt="Elysian Emporium"
                className="mx-auto"
              />
            </Section>

            {/* Main Content */}
            <Section className="px-[40px] pb-[48px]">
              <Heading className="text-[28px] font-semibold text-gray-900 text-center mb-[32px] leading-[34px]">
                Join {organizationName}
              </Heading>

              <Text className="text-[16px] text-gray-700 leading-[24px] mb-[32px] text-center">
                Hi there, you have been invited by {inviterName} to join the
                organization "{organizationName}".
              </Text>

              {/* Accept Button */}
              <Section className="text-center mb-[32px]">
                <Button
                  href={acceptUrl}
                  className="bg-[#4D00FF] text-white px-[40px] py-[14px] rounded-full text-[16px] font-medium no-underline box-border inline-block"
                >
                  Accept Invitation
                </Button>
              </Section>

              {/* Alternative Link */}
              <Text className="text-[14px] text-gray-600 leading-[20px] mb-[32px] text-center">
                Or copy and paste this URL into your browser:
                <br />
                <Link href={acceptUrl} className="text-[#4D00FF] break-all">
                  {acceptUrl}
                </Link>
              </Text>

              {/* Didn't Sign Up */}
              <Text className="text-[14px] text-gray-600 leading-[20px] text-center">
                If you believe this is an error, you can safely ignore this
                email.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default InvitationEmail;
