//@ts-nocheck
import { View } from "react-native";
import { Link, router } from "expo-router";
import RegisterForm from "@/components/Form/RegisterForm"; // Your existing RegisterForm
import Container from "@/components/Container";
import Typography from "@/components/Typography";

export default function Register() {
  const handleRegisterSuccess = () => {
    // After successful registration
    router.replace("/(tabs)/club/");
  };

  return (
    <Container bgColor="#000">
      <RegisterForm onRegisterSuccess={handleRegisterSuccess} />
      <Link href="club/auth/login">
        <Typography variant="body1" align="center">
          Aleady have an account? Login
        </Typography>
      </Link>
    </Container>
  );
}
