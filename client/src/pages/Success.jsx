import { useEffect } from "react";
import { useAppContext } from "../context/AppContext";

const Success = () => {

  const { axios, token, fetchUser, navigate } = useAppContext();

  useEffect(() => {

    const verify = async () => {

      const transactionId =
        new URLSearchParams(window.location.search).get("transactionId");

      await axios.post(
        "/api/credit/verify",
        { transactionId },
        { headers:{ Authorization:`Bearer ${token}` } }
      );

      await fetchUser(); // refresh credits
      navigate("/");
    };

    verify();

  }, []);

  return <div>Payment Successful...</div>;
};

export default Success;