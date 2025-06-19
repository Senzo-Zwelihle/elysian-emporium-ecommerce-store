import CreateNewStoreForm from "@/components/forms/create/create-store";
import { Container } from "@/components/ui/container";

export default function CreateStorePage() {
  return (
    <Container size={"2xl"} height={"full"} padding={"md"}>
      <CreateNewStoreForm />
    </Container>
  );
}
