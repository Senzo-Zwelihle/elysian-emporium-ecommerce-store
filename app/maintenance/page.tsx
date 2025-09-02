import React from "react";
import { Wrench } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/heading";
import { getMaintenanceMessage } from "@/lib/maintenance";

const MaintenancePage = async () => {
  const message = await getMaintenanceMessage();

  return (
    <Container
      size="lg"
      alignment="center"
      height="screen"
      padding="px-md"
      gap="lg"
      flow="col"
    >
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <Wrench className="h-24 w-24 text-muted-foreground" />
        </div>
        
        <div className="space-y-4">
          <Heading
            font="aeonik"
            size="lg"
            spacing="normal"
            lineHeight="none"
            margin="none"
          >
            Site Under Maintenance
          </Heading>
          
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            {message}
          </p>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p>We apologize for any inconvenience.</p>
          <p>Please try again later.</p>
        </div>
      </div>
    </Container>
  );
};

export default MaintenancePage;