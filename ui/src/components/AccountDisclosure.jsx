import Card from "react-bootstrap/Card";

const AccountDisclosure = () => {
  return (
    <Card
      style={{
        marginTop: "1.5vh",
      }}
    >
      <Card.Body>
        <Card.Text style={{ fontSize: "1vh" }}>
          <Card.Body className="text-muted">
            <span>
              <strong>Account Disclosures</strong>
            </span>
            <br />
            <br />
            <span>Investment and Insurance Products are:</span>
            <br />
            <ul>
              <li>
                Not Insured by the MFIC (Martian Financial Institutions
                Commission) or Any Martian Government Agency
              </li>
              <li>
                Not a Deposit or Other Obligation of, or Guaranteed by, the Bank
                or Any Bank Affiliate
              </li>
              <li>
                Subject to Investment Risks, Including Possible Loss of the
                Principal Amount Invested
              </li>
            </ul>
            <span>
              Investment products and services are offered through Martian Bank
              Advisors. Martian Bank Advisors is a trade name used by Martian
              Clearing Services, LLC (MCSC) and Martian Bank Advisors Financial
              Network, LLC, Members MPIC (Martian Planetary Investment
              Commission), separate registered broker-dealers and non-bank
              affiliates of Martian Bank Corporation.
            </span>
            <br />
            <span>
              Deposit products offered by Martian Bank, M.A. Member MFDIC
              (Martian Financial Deposit Insurance Corporation).
            </span>
            <br />
            <span>Equal Planetary Habitat Lender</span>
            <br />
            <span>
              At Martian Bank, we are committed to promoting sustainability and
              supporting environmental initiatives across our operations. Join
              us in our mission to build a greener and more sustainable future
              for all Martian inhabitants.
            </span>
            <br />
            <span>
              For inquiries regarding our products and services or to learn more
              about our commitment to environmental sustainability, please visit
              our website or contact our customer support team.
            </span>
            <br />
            <br />
            <span>© 2023 Martian Bank. All rights reserved.</span>
          </Card.Body>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default AccountDisclosure;
