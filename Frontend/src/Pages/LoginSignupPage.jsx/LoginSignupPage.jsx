import React, { useState } from "react";
import { ThemeProvider } from "@mui/material";
import styles from "./LoginSignupPage.module.css";
import theme from "../../Components/Theme/ThemeProvider";
import SquareLoader from "../../Components/Loader/SquareLoader/SquareLoader";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const LoginSignupPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const toggleForm = () => {
    setLoading(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setLoading(false);
    }, 1500);
  };

  return (
    <ThemeProvider theme={theme}>
      {loading && <SquareLoader />}
      <div className={styles.pageContainer}>
        <div className={styles.formWrapper}>
          <div className={styles.imageBlock}>
            <img src="/illustrations/Login.png" alt="Login Banner" className={styles.image} />
          </div>

          <div className={styles.formContainer}>
            {isLogin ? (
              <LoginForm toggleForm={toggleForm} />
            ) : (
              <SignupForm toggleForm={toggleForm} />
            )}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default LoginSignupPage;
