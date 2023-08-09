import { Modal } from "react-bootstrap";

const TermsAndConditionsModal = () => {
  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Terms and Conditions</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Welcome to Martian Bank! By opening an account with us, you agree to
          the following terms and conditions:
        </p>
        <h3>1. Eligibility</h3>
        <p>
          To open an account with Martian Bank, you must be a resident of Mars
          and at least 18 years old. You may be required to provide proof of
          identity and other supporting documents.
        </p>
        <h3>2. Account Information</h3>
        <p>
          You are responsible for providing accurate and up-to-date information
          during the account opening process. It is essential to keep your
          account information confidential and not share it with others.
        </p>
        <h3>3. Fees and Charges</h3>
        <p>
          Martian Bank may impose fees and charges for certain account services.
          These fees will be disclosed to you during the account opening process
          and may be subject to change. It is your responsibility to review and
          understand the applicable fees.
        </p>
        <h3>4. Termination</h3>
        <p>
          Martian Bank reserves the right to terminate or suspend your account
          if you violate the terms and conditions or engage in fraudulent or
          illegal activities. You may also request to close your account at any
          time, subject to any outstanding obligations.
        </p>
        <p>
          By opening an account with Martian Bank, you acknowledge that you have
          read, understood, and agreed to these Terms and Conditions. If you
          have any questions or concerns, please contact our customer support
          team.
        </p>
      </Modal.Body>
    </>
  );
};

export default TermsAndConditionsModal;
