import { Resend } from "resend";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const resend = new Resend("re_3YgGSjYD_MVvprvTumCuSyLDrBFEWkYMs");

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(bodyParser.json());

// OANDA Email Templates
const getWelcomeEmailTemplate = (data) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to OANDA</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            font-family: Arial, sans-serif;
        }
        .email-container {
            max-width: 800px;
            height: 500px;
            margin: 0 auto;
            background: #1e3a5f;
            position: relative;
            overflow: hidden;
        }
        .diagonal-section {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, #e5e7eb 0%, #e5e7eb 35%, #1e3a5f 35%, #1e3a5f 100%);
        }
        .logo {
            position: absolute;
            top: 20px;
            left: 30px;
            display: flex;
            align-items: center;
            color: white;
            z-index: 2;
        }
        .logo-icon {
            margin-right: 12px;
            display: inline-block;
            vertical-align: top;
            width: 35px;
            height: 36px;
        }
        .logo-bars {
            display: block;
            height: 28px;
            position: relative;
        }
        .bar {
            display: inline-block;
            vertical-align: bottom;
            width: 6px;
            margin-right: 2px;
        }
        .bar-1 {
            height: 14px;
            background-color: #22c55e;
        }
        .bar-2 {
            height: 20px;
            background-color: #22c55e;
        }
        .bar-3 {
            height: 28px;
            background-color: #1e3a8a;
        }
        .logo-base {
            display: block;
            width: 28px;
            height: 3px;
            background-color: #22c55e;
            margin-top: 2px;
        }
        .logo-text {
            font-weight: bold;
            font-size: 20px;
            letter-spacing: 2px;
        }
        .logo-subtext {
            position: absolute;
            width:250px;
            top: 35px;
            left: 0;
            font-size: 10px;
            letter-spacing: 3px;
            opacity: 0.8;
        }
        .title {
            position: absolute;
            top: 9%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 28px;
            font-weight: bold;
            color: white;
            text-align: center;
            letter-spacing: 2px;
            z-index: 2;
        }
        .welcome-details {
            position: absolute;
            top: 140px;
            right: 40px;
            color: white;
            font-size: 12px;
            line-height: 1.8;
            z-index: 2;
        }
        .status-active {
            color: #22c55e;
            font-weight: bold;
        }
        .user-info {
            position: absolute;
            bottom: 120px;
            left: 40px;
            color: #374151;
            font-size: 12px;
            line-height: 1.8;
            z-index: 2;
        }
        .welcome-message {
            position: absolute;
            bottom: 40px;
            left: 40px;
            color: #374151;
            font-size: 12px;
            line-height: 1.6;
            z-index: 2;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="diagonal-section"></div>
        
        <div class="logo">
            <div class="logo-icon">
                <div class="logo-bars">
                    <div class="bar bar-1"></div><!--
                 --><div class="bar bar-2"></div><!--
                 --><div class="bar bar-3"></div>
                </div>
                <div class="logo-base"></div>
            </div>
            <div>
                <div class="logo-text">OANDA</div>
                <div class="logo-subtext">SMARTER TRADING</div>
            </div>
        </div>
        
        <div class="title">WELCOME TO OANDA</div>
        
        <div class="welcome-details">
            <div>Date: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
            <div>Time: ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
            <div>Registration Type: New Account</div>
            <div>Status: <span class="status-active">Active</span></div>
        </div>
        
        <div class="user-info">
            <div>Username/ID: ${data.accountId || 'user12345'}</div>
            <div>Email: ${data.email || 'user@example.com'}</div>
            <div>Full Name: ${data.name || 'John Doe'}</div>
            <div>Account Type: Trading Account</div>
            <div>Initial Balance: 0.00 USD</div>
        </div>
        
        <div class="welcome-message">
            <div>Welcome to the world of smarter trading!</div>
            <div>Your journey starts here.</div>
        </div>
    </div>
</body>
</html>`;
};


const getDepositEmailTemplate = (data) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OANDA Deposit Confirmation</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            font-family: Arial, sans-serif;
        }
        .email-container {
            max-width: 800px;
            height: 500px;
            margin: 0 auto;
            background: #1e3a5f;
            position: relative;
            overflow: hidden;
        }
        .diagonal-section {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, #e5e7eb 0%, #e5e7eb 40%, #1e3a5f 40%, #1e3a5f 100%);
        }
        .logo {
            position: absolute;
            top: 20px;
            left: 30px;
            display: flex;
            align-items: center;
            color: white;
            z-index: 2;
        }
        .logo-icon {
            margin-right: 12px;
            display: inline-block;
            vertical-align: top;
            width: 35px;
            height: 36px;
        }
        .logo-bars {
            display: block;
            height: 28px;
            position: relative;
        }
        .bar {
            display: inline-block;
            vertical-align: bottom;
            width: 6px;
            margin-right: 2px;
        }
        .bar-1 {
            height: 14px;
            background-color: #22c55e;
        }
        .bar-2 {
            height: 20px;
            background-color: #22c55e;
        }
        .bar-3 {
            height: 28px;
            background-color: #1e3a8a;
        }
        .logo-base {
            display: block;
            width: 28px;
            height: 3px;
            background-color: #22c55e;
            margin-top: 2px;
        }
        .logo-text {
            font-weight: bold;
            font-size: 20px;
            letter-spacing: 2px;
        }
        .logo-subtext {
            position: absolute;
            top: 33px;
            width:250px;
            left: 0;
            font-size: 10px;
            letter-spacing: 3px;
            opacity: 0.8;
        }
        .title {
            position: absolute;
            top: 8%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 28px;
            font-weight: bold;
            color: white;
            text-align: center;
            letter-spacing: 2px;
            z-index: 2;
        }
        .transaction-details {
            position: absolute;
            top: 140px;
            right: 40px;
            color: white;
            font-size: 12px;
            line-height: 1.8;
            z-index: 2;
        }
        .status-completed {
            color: #22c55e;
            font-weight: bold;
        }
        .user-info {
            position: absolute;
            bottom: 120px;
            left: 40px;
            color: #374151;
            font-size: 12px;
            line-height: 1.8;
            z-index: 2;
        }
        .wallet-info {
            position: absolute;
            bottom: 40px;
            left: 40px;
            color: #374151;
            font-size: 12px;
            line-height: 1.6;
            z-index: 2;
        }
        .wallet-address {
            font-family: 'Courier New', monospace;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="diagonal-section"></div>
        
        <div class="logo">
            <div class="logo-icon">
                <div class="logo-bars">
                    <div class="bar bar-1"></div><!--
                 --><div class="bar bar-2"></div><!--
                 --><div class="bar bar-3"></div>
                </div>
                <div class="logo-base"></div>
            </div>
            <div>
                <div class="logo-text">OANDA</div>
                <div class="logo-subtext">SMARTER TRADING</div>
            </div>
        </div>
        
        <div class="title">OANDA DEPOSIT CONFIRMATION</div>
        
        <div class="transaction-details">
            <div>Date: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
            <div>Time: ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
            <div>Transaction Type: Deposit</div>
            <div>Status: <span class="status-completed">Completed</span></div>
        </div>
        
        <div class="user-info">
            <div>Username/ID: ${data.accountId || 'user12345'}</div>
            <div>Email: ${data.email || 'user@example.com'}</div>
            <div>Currency: ${data.currency}</div>
            <div>Amount Deposit: ${data.amount} ${data.currency}</div>
            <div>Network Fee: 0 ${data.currency}</div>
            <div>Total Sent: ${data.amount} ${data.currency}</div>
        </div>
        
        <div class="wallet-info">
            <div>Destination Wallet:</div>
            <div class="wallet-address">${data.transactionHash || 'bc1qxy2kgdygjrskjhnf0yrf2493p8poifjhx0wlh'}</div>
        </div>
    </div>
</body>
</html>`;
};

const getWithdrawalEmailTemplate = (data) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OANDA Withdrawal Confirmation</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
            font-family: Arial, sans-serif;
        }
        .email-container {
            max-width: 800px;
            height: 500px;
            margin: 0 auto;
            background: #1e3a5f;
            position: relative;
            overflow: hidden;
        }
        .diagonal-section {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, #e5e7eb 0%, #e5e7eb 40%, #1e3a5f 40%, #1e3a5f 100%);
        }
        .logo {
            position: absolute;
            top: 12px;
            left: 30px;
            display: flex;
            align-items: center;
            color: white;
            z-index: 2;
        }
        .logo-icon {
            margin-right: 12px;
            display: flex;
            flex-direction: column;
        }
        .logo-bars {
            display: flex;
            align-items: flex-end;
            gap: 2px;
            margin-bottom: 4px;
        }
        .bar {
            width: 8px;
            transform: skewX(-12deg);
        }
        .bar-1 {
            height: 12px;
            background-color: #22c55e;
        }
        .bar-2 {
            height: 24px;
            background-color: #22c55e;
        }
        .bar-3 {
            height: 32px;
            background-color: #1e3a8a;
        }
        .logo-base {
            width: 32px;
            height: 4px;
            background-color: #22c55e;
        }
        .logo-text {
            font-weight: bold;
            font-size: 20px;
            letter-spacing: 2px;
        }
        .logo-subtext {
            position: absolute;
            width:250px;
            top: 40px;
            left: 0;
            font-size: 10px;
            letter-spacing: 3px;
            opacity: 0.8;
        }
        .title {
            position: absolute;
            top: 10%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 24px;
            font-weight: bold;
            color: white;
            text-align: center;
            letter-spacing: 2px;
            z-index: 2;
        }
        .transaction-details {
            position: absolute;
            top: 120px;
            right: 40px;
            color: white;
            font-size: 12px;
            line-height: 1.8;
            z-index: 2;
        }
        .status-completed {
            color: #22c55e;
            font-weight: bold;
        }
        .user-info {
            position: absolute;
            bottom: 90px;
            left: 40px;
            color: #374151;
            font-size: 12px;
            line-height: 1.8;
            z-index: 2;
        }
        .wallet-info {
            position: absolute;
            bottom: 40px;
            left: 40px;
            color: #374151;
            font-size: 12px;
            line-height: 1.6;
            z-index: 2;
        }
        .wallet-address {
            font-family: 'Courier New', monospace;
            margin-top: 5px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="diagonal-section"></div>
        
        <div class="logo">
            <div class="logo-icon">
                <div class="logo-bars">
                    <div class="bar bar-1"></div>
                    <div class="bar bar-2"></div>
                    <div class="bar bar-3"></div>
                </div>
                <div class="logo-base"></div>
            </div>
            <div>
                <div class="logo-text">OANDA</div>
                 <div class="logo-subtext">SMARTER TRADING</div>
            </div>
        </div>
        
        <div class="title">OANDA WITHDRAWAL CONFIRMATION</div>
        
        <div class="transaction-details">
            <div>Date: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
            <div>Time: ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
            <div>Transaction Type: Withdrawal</div>
            <div>Status: <span class="status-completed">Completed</span></div>
        </div>
        
        <div class="user-info">
            <div>Username/ID: ${data.accountId || 'user12345'}</div>
            <div>Email: ${data.email || 'user@example.com'}</div>
            <div>Currency: ${data.currency}</div>
            <div>Amount Withdraw: ${data.amount} ${data.currency}</div>
            <div>Network Fee: 1 ${data.currency}</div>
            <div>Total Sent: ${parseFloat(data.amount) - 1} ${data.currency}</div>
        </div>
        
        <div class="wallet-info">
            <div>Destination Wallet:</div>
            <div class="wallet-address">${data.traceId || 'bc1qxy2kgdygjrskjhnf0yrf2493p8poifjhx0wlh'}</div>
        </div>
    </div>
</body>
</html>`;
};

app.get("/", async (req, res) => {
  res.json({
    message: 'Bon Plan Finance Email API',
    endpoints: {
      'POST /send_email': 'Send welcome email',
      'POST /send_email_notification': 'Send notification email',
      'POST /send_deposit_confirmation': 'Send OANDA deposit confirmation',
      'POST /send_withdrawal_confirmation': 'Send OANDA withdrawal confirmation',
      'GET /preview_deposit': 'Preview deposit confirmation template',
      'GET /preview_withdrawal': 'Preview withdrawal confirmation template'
    }
  });
});

// New OANDA welcome email endpoint
app.post("/send_welcome_email", async (req, res) => {
  const {
    email,
    name,
    accountId
  } = req.body;

  try {
    const htmlContent = getWelcomeEmailTemplate({
      email,
      name,
      accountId
    });

    const data = await resend.emails.send({
      from: "info@bonplanfinance.com",
      to: email,
      subject: `Welcome to OANDA - Your Account is Ready!`,
      html: htmlContent,
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
});

// New OANDA deposit confirmation endpoint
app.post("/send_deposit_confirmation", async (req, res) => {
  const {
    email,
    accountId,
    amount,
    currency = 'USDT',
    transactionHash
  } = req.body;

  try {
    const htmlContent = getDepositEmailTemplate({
      email,
      accountId,
      amount,
      currency,
      transactionHash
    });

    const data = await resend.emails.send({
      from: "info@bonplanfinance.com",
      to: email,
      subject: `OANDA Deposit Confirmation - ${amount} ${currency}`,
      html: htmlContent,
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
});

// New OANDA withdrawal confirmation endpoint
app.post("/send_withdrawal_confirmation", async (req, res) => {
  const {
    email,
    accountId,
    amount,
    currency = 'USDT',
    traceId
  } = req.body;

  try {
    const htmlContent = getWithdrawalEmailTemplate({
      email,
      accountId,
      amount,
      currency,
      traceId
    });

    const data = await resend.emails.send({
      from: "info@bonplanfinance.com",
      to: email,
      subject: `OANDA Withdrawal Confirmation - ${amount} ${currency}`,
      html: htmlContent,
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
});

// Preview endpoints for OANDA templates
app.get("/preview_welcome", async (req, res) => {
  const sampleData = {
    email: 'john.doe@example.com',
    name: 'John Doe',
    accountId: 'ACC789123'
  };

  const htmlContent = getWelcomeEmailTemplate(sampleData);
  res.send(htmlContent);
});

// Preview endpoints for OANDA templates
app.get("/preview_deposit", async (req, res) => {
  const sampleData = {
    email: 'user@example.com',
    accountId: 'user12345',
    amount: '100',
    currency: 'USDT',
    transactionHash: 'bc1qxy2kgdygjrskjhnf0yrf2493p8poifjhx0wlh'
  };

  const htmlContent = getDepositEmailTemplate(sampleData);
  res.send(htmlContent);
});



app.get("/preview_withdrawal", async (req, res) => {
  const sampleData = {
    email: 'user@example.com',
    accountId: 'user12345',
    amount: '100',
    currency: 'USDT',
    traceId: 'bc1qxy2kgdygjrskjhnf0yrf2493p8poifjhx0wlh'
  };

  const htmlContent = getWithdrawalEmailTemplate(sampleData);
  res.send(htmlContent);
});

app.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});