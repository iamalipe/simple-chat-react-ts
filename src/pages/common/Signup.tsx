import { Link, useNavigate } from "react-router-dom";
import { RouteNames } from "../../types";
import { useState } from "react";
// import { toast } from "../../libs";
// import { useGlobalState } from "../../state";

interface ErrorMsg {
  email: string | null;
  username: string | null;
  password: string | null;
  repeatPassword: string | null;
}

const Signup = () => {
  const [signupInfo, setSignupInfo] = useState({
    email: "",
    username: "",
    password: "",
    repeatPassword: "",
  });

  const [signupError, setSignupError] = useState<ErrorMsg>({
    email: null,
    username: null,
    password: null,
    repeatPassword: null,
  });

  // const { state } = useGlobalState();
  // const navigate = useNavigate();

  const onChangeSignupInfo: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    setSignupInfo((prev) => ({ ...prev, [fieldName]: fieldValue }));
  };

  const onFormSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex-1 flex justify-center">
      <div className="flex flex-col w-full max-w-md mt-[10%] sm:mt-[5%] h-fit px-4">
        <div className="text-center">
          <div className="text-3xl font-semibold mb-3 tracking-tight">
            Welcome to Chat App
          </div>
          <div className="btn-group mb-6">
            <span>
              Already have an account?
              <Link
                to={RouteNames.LOGIN}
                className="daisy-link font-semibold ml-1"
              >
                Login
              </Link>
            </span>
          </div>
        </div>
        <form onSubmit={onFormSubmit} className="flex flex-col gap-4">
          <label>
            <span className="text-lg font-medium ml-2">Username</span>
            <input
              value={signupInfo.username}
              onChange={onChangeSignupInfo}
              name="username"
              type="text"
              placeholder="enter your username"
              className="daisy-input daisy-input-bordered text-lg daisy-input-md w-full mt-1"
            />
            {signupError.username && (
              <span className="text-error text-sm font-medium ml-2">
                {signupError.username}
              </span>
            )}
          </label>
          <label>
            <span className="text-lg font-medium ml-2">Email</span>
            <input
              value={signupInfo.email}
              onChange={onChangeSignupInfo}
              name="email"
              type="email"
              placeholder="enter your email"
              className="daisy-input daisy-input-bordered text-lg daisy-input-md w-full mt-1"
            />
            {signupError.email && (
              <span className="text-error text-sm font-medium ml-2">
                {signupError.email}
              </span>
            )}
          </label>
          <label>
            <span className="text-lg font-medium ml-2">Password</span>
            <input
              value={signupInfo.password}
              onChange={onChangeSignupInfo}
              name="password"
              type="password"
              placeholder="enter your password"
              className="daisy-input daisy-input-bordered text-lg daisy-input-md w-full mt-1"
            />
            {signupError.password && (
              <span className="text-error text-sm font-medium ml-2">
                {signupError.password}
              </span>
            )}
          </label>
          <label>
            <span className="text-lg font-medium ml-2">Re-enter password</span>
            <input
              value={signupInfo.repeatPassword}
              onChange={onChangeSignupInfo}
              name="repeatPassword"
              type="password"
              placeholder="re-enter your password"
              className="daisy-input daisy-input-bordered text-lg daisy-input-md w-full mt-1"
            />
            {signupError.repeatPassword && (
              <span className="text-error text-sm font-medium ml-2">
                {signupError.repeatPassword}
              </span>
            )}
          </label>
          <button className="daisy-btn daisy-btn-primary">Sign up</button>
        </form>
      </div>
    </div>
  );
};
export default Signup;
