type PasswordStrength = "weak" | "strong";

export function passwordCheck(password: string): PasswordStrength {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  if (passwordRegex.test(password)) {
    return "strong";
  } else {
    return "weak";
  }
}
