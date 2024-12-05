//@ts-nocheck
import { View } from "react-native";
import { Link, router } from "expo-router";
import RegisterForm from "@/components/Form/RegisterForm"; // Your existing RegisterForm
import Container from "@/components/Container";
import Typography from "@/components/Typography";
import { useAuth } from "@/context/auth";

export default function Register() {
  const { register } = useAuth();

  return (
    <Container bgColor="#000" style={{ paddingTop: 50 }}>
      <RegisterForm handleRegister={register} />
      <Link href="club/auth/login" style={{ marginVertical: 10 }}>
        <Typography variant="body1" align="center">
          Aleady have an account? Login
        </Typography>
      </Link>
    </Container>
  );
}
