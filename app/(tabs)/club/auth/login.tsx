import React from "react";
import { View } from "react-native";
import { Link, router } from "expo-router";
import LoginForm from "@/components/Form/LoginForm"; // Your existing LoginForm
import Typography from "@/components/Typography";
import Container from "@/components/Container";
import { useAuth } from "@/context/auth";

export default function Login() {
  const { login } = useAuth();

  return (
    <Container bgColor="#000">
      {/* @ts-ignore */}
      <LoginForm handleLogin={login} />
      <Link href="club/auth/register">
        <Typography variant="body1" align="center">
          Don't have an account? Register
        </Typography>
      </Link>
    </Container>
  );
}
