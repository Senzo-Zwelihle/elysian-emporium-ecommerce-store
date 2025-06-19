import React from "react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

const SettingsRoutePage = () => {
  return (
    <Container size={"2xl"} height={"full"} padding={"md"} className="my-2">
      <div className="flex items-center justify-between">
        <Heading
          size={"md"}
          font={"PolySansBulky"}
          spacing={"normal"}
          lineHeight={"none"}
          margin={"sm"}
        >
          Settings
        </Heading>
      </div>

      <div>
        <ThemeSwitcher />
      </div>
    </Container>
  );
};

export default SettingsRoutePage;
