import React, { useState } from "react";
import {
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  Button,
  Form,
  FormFeedback,
  Alert,
  Spinner,
} from "reactstrap";

import { FaMobileAlt, FaKey } from "react-icons/fa";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { useFormik } from "formik";
import logoLight from "../../assets/images/logo-light.png";
import withRouter from "../../Components/Common/withRouter";
import { loginWithOtp } from "../../slices/auth/login/thunk";
import { useDispatch } from "react-redux";



const Login = (props) => {
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const dispatch = useDispatch();
  const validation = useFormik({
    initialValues: {
      phone: "",
      otp: "",
    },
    validationSchema: Yup.object({
      phone: Yup.string()
        .required("Please enter your phone number")
        .matches(/^\+\d{10,15}$/, "Enter phone in E.164 format, e.g., +919999999999"),
      otp: Yup.string().when("phone", {
        is: (val) => otpSent && val,
        then: (schema) => schema.required("Please enter the OTP"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
    onSubmit: () => {},
  });


  const USE_MOCK = true; // Set to false to use real API

const handleSendOtp = async () => {
  setOtpLoading(true);
  setOtpError("");
  setOtpSuccess("");
  if (USE_MOCK) {
    setTimeout(() => {
      setOtpSent(true);
      setOtpSuccess("OTP sent successfully! (Mocked)");
      setOtpLoading(false);
    }, 1000);
  } else {
    try {
      const res = await fetch("http://localhost:5000/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: validation.values.phone }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        setOtpSuccess("OTP sent successfully!");
      } else {
        setOtpError(data.error || "Failed to send OTP");
        setOtpSent(false);
      }
    } catch (err) {
      setOtpError("Network error");
    }
    setOtpLoading(false);
  }
};

const handleVerifyOtp = async () => {
  setVerifyLoading(true);
  setOtpError("");
  if (USE_MOCK) {
    setTimeout(() => {
      setIsVerified(true);
      setOtpSuccess("OTP verified! You can now sign in. (Mocked)");
      setVerifyLoading(false);
    }, 1000);
  } else {
    try {
      const res = await fetch("http://localhost:5000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: validation.values.phone,
          otp: validation.values.otp,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsVerified(true);
        setOtpSuccess("OTP verified! You can now sign in.");
      } else {
        setOtpError(data.error || "OTP verification failed");
      }
    } catch (err) {
      setOtpError("Network error");
    }
    setVerifyLoading(false);
  }
};

  // const handleSendOtp = async () => {
  //   setOtpLoading(true);
  //   setOtpError("");
  //   setOtpSuccess("");
  //   try {
  //     const res = await fetch("http://localhost:5000/api/send-otp", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ phone: validation.values.phone }),
  //     });
  //     const data = await res.json();
  //     if (data.success) {
  //       setOtpSent(true);
  //       setOtpSuccess("OTP sent successfully!");
  //     } else {
  //       setOtpError(data.error || "Failed to send OTP");
  //       setOtpSent(false);
  //     }
  //   } catch (err) {
  //     setOtpError("Network error");
  //   }
  //   setOtpLoading(false);
  // };

  // const handleVerifyOtp = async () => {
  //   setVerifyLoading(true);
  //   setOtpError("");
  //   try {
  //     const res = await fetch("http://localhost:5000/api/verify-otp", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         phone: validation.values.phone,
  //         otp: validation.values.otp,
  //       }),
  //     });
  //     const data = await res.json();
  //     if (data.success) {
  //       setIsVerified(true);
  //       setOtpSuccess("OTP verified! You can now sign in.");
  //     } else {
  //       setOtpError(data.error || "OTP verification failed");
  //     }
  //   } catch (err) {
  //     setOtpError("Network error");
  //   }
  //   setVerifyLoading(false);
  // };

  const handleSignIn = () => {
  if (isVerified) {
    dispatch(loginWithOtp(validation.values.phone, props.router.navigate));
  }
};

  return (
    <React.Fragment>
      <ParticlesAuth>
        <div className="auth-page-content mt-lg-5">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="text-center mt-sm-5 mb-4 text-white-50">
                  <div>
                    <Link to="/" className="d-inline-block auth-logo">
                      <img src={logoLight} alt="" height="70" />
                    </Link>
                  </div>
                </div>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col md={8} lg={6} xl={5}>
                <Card className="mt-4 card-bg-fill">
                  <CardBody className="p-4">
                    <div className="text-center mt-2">
                      <h5 className="text-primary">Welcome Back !</h5>
                      <p className="text-muted">
                        Sign in to continue to Houzing Partners.
                      </p>
                    </div>
                    <div className="p-2 mt-4">
                      <Form onSubmit={(e) => e.preventDefault()} autoComplete="off">
                        {/* Phone Number Input */}
                        <div className="mb-4">
                          <Label htmlFor="phone" className="form-label fw-semibold">
                            Phone Number
                          </Label>
                          <div className="input-group">
                            <span className="input-group-text bg-light">
                              <FaMobileAlt />
                            </span>
                            <Input
                              name="phone"
                              className="form-control"
                              placeholder="e.g. +919999999999"
                              type="tel"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.phone || ""}
                              invalid={validation.touched.phone && validation.errors.phone}
                              disabled={isVerified}
                            />
                            <Button
                              type="button"
                              color="primary"
                              outline
                              disabled={
                                otpLoading || !validation.values.phone || isVerified
                              }
                              onClick={handleSendOtp}
                              style={{
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
                              }}
                            >
                              {otpLoading ? ( <Spinner size="sm" /> ) : otpSent ? ( "Resend OTP") : ( "Send OTP" )}
                            </Button>
                          </div>
                          {validation.touched.phone && validation.errors.phone && (
                            <FormFeedback type="invalid" style={{ display: "block" }}>
                              {validation.errors.phone}
                            </FormFeedback>
                          )}
                          {otpError && (
                            <Alert color="danger" className="mt-2 py-1 px-2">
                              {otpError}
                            </Alert>
                          )}
                          {otpSuccess && (
                            <Alert color="success" className="mt-2 py-1 px-2">
                              {otpSuccess}
                            </Alert>
                          )}
                        </div>

                        {/* OTP Input */}
                        <div className="mb-4">
                          <Label htmlFor="otp" className="form-label fw-semibold">
                            OTP
                          </Label>
                          <div className="input-group">
                            <span className="input-group-text bg-light">
                              <FaKey />
                            </span>
                            <Input
                              name="otp"
                              className="form-control"
                              placeholder="Enter OTP"
                              type="text"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.otp || ""}
                              invalid={validation.touched.otp && validation.errors.otp}
                              disabled={isVerified}
                            />
                            <Button
                              color={isVerified ? "success" : "success"}
                              outline={!isVerified}
                              disabled={
                                verifyLoading || isVerified || !validation.values.otp
                              }
                              type="button"
                              onClick={handleVerifyOtp}
                              style={{
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
                              }}
                            >
                              {verifyLoading ? (
                                <Spinner size="sm" className="me-2" />
                              ) : isVerified ? (
                                "Verified"
                              ) : (
                                "Verify"
                              )}
                            </Button>
                          </div>
                          {validation.touched.otp && validation.errors.otp && (
                            <FormFeedback type="invalid" style={{ display: "block" }}>
                              {validation.errors.otp}
                            </FormFeedback>
                          )}
                        </div>

                        {/* Sign In Button */}
                        {isVerified && (
                          <div className="text-center">
                            <Button color="primary" type="button" onClick={handleSignIn}>
                              Sign In
                            </Button>
                          </div>
                        )}
                      </Form>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </ParticlesAuth>
    </React.Fragment>
  );
};

export default withRouter(Login);
